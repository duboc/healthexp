import os
import logging
from typing import Union, List, Any
from google.api_core.exceptions import ResourceExhausted

import vertexai
from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    HarmCategory,
    Part,
)
import vertexai.generative_models as generative_models
from vertexai.preview.vision_models import (
    ImageGenerationModel,
    MultiModalEmbeddingModel,
)

# Import tenacity for retry logic
from tenacity import retry, stop_after_attempt, wait_exponential

class GeminiRegionClient:
    """
    A client for interacting with Gemini API with region fallback capabilities.
    """
    
    def __init__(self, project_id: str = None, logger: logging.Logger = None):
        """
        Initialize the GeminiRegionClient.
        
        Args:
            project_id (str, optional): Google Cloud Project ID. If None, will try to get from environment.
            logger (logging.Logger, optional): Custom logger instance. If None, will create a new one.
        """
        self.project_id = project_id or os.environ.get("GCP_PROJECT")
        if not self.project_id:
            raise ValueError("Project ID must be provided or set in GCP_PROJECT environment variable")
            
        self.logger = logger or logging.getLogger(__name__)
        
        # List of regions to try
        self.regions = [
            "us-central1",
            "europe-west2",
            "europe-west3",
            "asia-northeast1",
            "australia-southeast1",
            "asia-south1"
        ]
        
        # Safety settings configuration
        self.safety_settings = {
            generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_NONE,
            generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
            generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_NONE,
            generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
        }
        
        # Default generation config
        self.default_generation_config = GenerationConfig(
            max_output_tokens=8192,
            temperature=1,
            top_p=0.95,
            response_mime_type="application/json",
            response_schema={"type":"OBJECT","properties":{"response":{"type":"STRING"}}},
        )

    def _initialize_region(self, region: str) -> None:
        """Initialize Vertex AI with the specified region."""
        vertexai.init(project=self.project_id, location=region)
        
    def _get_model(self) -> GenerativeModel:
        """Get the Gemini model instance."""
        return GenerativeModel("gemini-2.0-flash-001")

    @retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
    def generate_content(self, 
                        prompt: Union[str, List[Union[str, Part]]], 
                        response_mime_type: str = None,
                        **kwargs) -> str:
        """
        Generate content using Gemini model with region fallback.
        
        Args:
            prompt: The input prompt (string or list of string/Part for multimodal)
            response_mime_type: Optional MIME type for the response
            **kwargs: Additional arguments to pass to generate_content
            
        Returns:
            str: Generated content
            
        Raises:
            Exception: If all regions fail
        """
        last_error = None
        
        for region in self.regions:
            try:
                self._initialize_region(region)
                model = self._get_model()
                
                # Prepare generation config
                gen_config = kwargs.pop('generation_config', self.default_generation_config)
                if response_mime_type:
                    gen_config = GenerationConfig(
                        **gen_config.to_dict(),
                        response_mime_type=response_mime_type
                    )
                
                # Process multimodal input if needed
                if isinstance(prompt, list) and len(prompt) == 2:
                    image_content, text_prompt = prompt
                    if not isinstance(image_content, Part):
                        image_content = Part.from_data(image_content, mime_type="image/jpeg")
                    prompt = [image_content, text_prompt]
                
                response = model.generate_content(
                    prompt,
                    generation_config=gen_config,
                    safety_settings=self.safety_settings,
                    **kwargs
                )
                
                return response.text
                
            except ResourceExhausted as e:
                self.logger.warning(f"Region {region} exhausted. Trying next region...")
                last_error = e
            except Exception as e:
                self.logger.warning(f"Unexpected error with region {region}: {str(e)}")
                last_error = e
        
        raise Exception(f"All regions failed. Last error: {str(last_error)}") from last_error
