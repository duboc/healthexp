import os
import uuid
import logging
from pathlib import Path
from typing import Tuple, Optional
import base64

logger = logging.getLogger(__name__)

# Define allowed file extensions
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf'}

def allowed_file(filename: str) -> bool:
    """
    Check if the file has an allowed extension.
    
    Args:
        filename (str): The filename to check
        
    Returns:
        bool: True if the file extension is allowed
    """
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file_data: bytes, original_filename: str, upload_dir: str = "uploads") -> Tuple[str, str]:
    """
    Save an uploaded file to disk.
    
    Args:
        file_data (bytes): The file data
        original_filename (str): The original filename
        upload_dir (str): Directory to save the file
        
    Returns:
        Tuple[str, str]: (file path, file type)
    """
    try:
        # Create upload directory if it doesn't exist
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate a unique filename
        file_extension = Path(original_filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save the file
        with open(file_path, 'wb') as f:
            f.write(file_data)
        
        logger.info(f"Saved uploaded file to {file_path}")
        
        # Return the file path and type
        file_type = file_extension[1:]  # Remove the dot
        return file_path, file_type
    
    except Exception as e:
        logger.error(f"Error saving uploaded file: {str(e)}")
        raise

def decode_base64_file(base64_data: str) -> Tuple[bytes, Optional[str]]:
    """
    Decode a base64-encoded file.
    
    Args:
        base64_data (str): Base64-encoded file data, may include MIME type prefix
        
    Returns:
        Tuple[bytes, Optional[str]]: (decoded file data, file type)
    """
    try:
        # Check if the base64 data includes a MIME type prefix
        if ';base64,' in base64_data:
            mime_type, base64_data = base64_data.split(';base64,')
            mime_type = mime_type.split(':')[1] if ':' in mime_type else mime_type
            file_type = mime_type.split('/')[1] if '/' in mime_type else None
        else:
            file_type = None
        
        # Decode the base64 data
        file_data = base64.b64decode(base64_data)
        
        logger.info(f"Decoded base64 file of type: {file_type}")
        return file_data, file_type
    
    except Exception as e:
        logger.error(f"Error decoding base64 file: {str(e)}")
        raise

def get_file_mime_type(file_path: str) -> str:
    """
    Get the MIME type of a file based on its extension.
    
    Args:
        file_path (str): Path to the file
        
    Returns:
        str: MIME type
    """
    extension = Path(file_path).suffix.lower()
    mime_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.pdf': 'application/pdf'
    }
    return mime_types.get(extension, 'application/octet-stream')
