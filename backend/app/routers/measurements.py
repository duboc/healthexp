from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Body
from fastapi.responses import JSONResponse
import os
import logging
import json
from typing import List, Optional
import tempfile
import shutil
from pydantic import ValidationError

from ..schemas.measurement import (
    FileUpload,
    MeasurementData,
    MeasurementResponse,
    MeasurementsListResponse
)
from ..services.gemini_service import GeminiService
from ..services.firestore_service import FirestoreService
from ..utils.file_utils import (
    allowed_file,
    save_uploaded_file,
    decode_base64_file
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Create service instances
gemini_service = GeminiService()
firestore_service = FirestoreService()

@router.post("/upload", response_model=MeasurementResponse)
async def upload_measurement_file(
    file: UploadFile = File(...),
):
    """
    Upload and process an InBody measurement file.
    
    Args:
        file: The uploaded file
        
    Returns:
        MeasurementResponse: The processed measurement data
    """
    try:
        # Check if file is allowed
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join([ext[1:] for ext in ['.jpg', '.jpeg', '.png', '.pdf']])}"
            )
        
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # Process the file with Gemini
            measurement_data = gemini_service.process_inbody_image(temp_file_path)
            
            # Save the data to Firestore
            doc_id = firestore_service.save_measurement(measurement_data)
            
            # Return the response
            return MeasurementResponse(
                success=True,
                message="Measurement processed and saved successfully",
                data=MeasurementData(**measurement_data),
                id=doc_id
            )
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)
    
    except Exception as e:
        logger.error(f"Error processing measurement file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing measurement file: {str(e)}"
        )

@router.post("/upload-base64", response_model=MeasurementResponse)
async def upload_base64_file(
    file_upload: FileUpload = Body(...),
):
    """
    Upload and process a base64-encoded InBody measurement file.
    
    Args:
        file_upload: The base64-encoded file data
        
    Returns:
        MeasurementResponse: The processed measurement data
    """
    try:
        # Decode the base64 file
        file_data, file_type = decode_base64_file(file_upload.file_data)
        
        # Use the provided file type if available
        file_type = file_upload.file_type or file_type
        
        if not file_type:
            raise HTTPException(
                status_code=400,
                detail="Could not determine file type. Please provide file_type."
            )
        
        # Save the file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_type}") as temp_file:
            temp_file.write(file_data)
            temp_file_path = temp_file.name
        
        try:
            # Process the file with Gemini
            measurement_data = gemini_service.process_inbody_image(temp_file_path)
            
            # Save the data to Firestore
            doc_id = firestore_service.save_measurement(measurement_data)

            # Return the response
            try:
                return MeasurementResponse(
                    success=True,
                    message="Measurement processed and saved successfully",
                    data=MeasurementData(**measurement_data),
                    id=doc_id
                )
            except ValidationError as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Validation error: {e}"
                )
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)

    except Exception as e:
        logger.error(f"Error processing base64 measurement file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing measurement file: {str(e)}"
        )


@router.get("", response_model=MeasurementsListResponse)
async def get_all_measurements():
    """
    Get all measurements.
    
    Returns:
        MeasurementsListResponse: List of all measurements
    """
    try:
        # Get all measurements from Firestore
        measurements = firestore_service.get_all_measurements()
        
        # Return the response
        return MeasurementsListResponse(
            success=True,
            message=f"Retrieved {len(measurements)} measurements",
            data=measurements
        )
    
    except Exception as e:
        logger.error(f"Error getting measurements: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting measurements: {str(e)}"
        )

@router.get("/{measurement_id}", response_model=MeasurementResponse)
async def get_measurement(measurement_id: str):
    """
    Get a specific measurement by ID.
    
    Args:
        measurement_id: The measurement ID
        
    Returns:
        MeasurementResponse: The measurement data
    """
    try:
        # Get the measurement from Firestore
        measurement = firestore_service.get_measurement(measurement_id)
        
        if not measurement:
            raise HTTPException(
                status_code=404,
                detail=f"Measurement with ID {measurement_id} not found"
            )
        
        # Return the response
        return MeasurementResponse(
            success=True,
            message=f"Retrieved measurement {measurement_id}",
            data=MeasurementData(**measurement),
            id=measurement_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting measurement {measurement_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting measurement: {str(e)}"
        )

@router.put("/{measurement_id}", response_model=MeasurementResponse)
async def update_measurement(
    measurement_id: str,
    measurement_data: MeasurementData = Body(...),
):
    """
    Update a measurement by ID.
    
    Args:
        measurement_id: The measurement ID
        measurement_data: The updated measurement data
        
    Returns:
        MeasurementResponse: The updated measurement data
    """
    try:
        # Check if the measurement exists
        existing_measurement = firestore_service.get_measurement(measurement_id)
        
        if not existing_measurement:
            raise HTTPException(
                status_code=404,
                detail=f"Measurement with ID {measurement_id} not found"
            )
        
        # Update the measurement in Firestore
        updated_data = measurement_data.model_dump(exclude_unset=True)
        
        # Preserve the ID
        updated_data["id"] = measurement_id
        
        # Save the updated data
        firestore_service.save_measurement(updated_data, measurement_id)
        
        # Return the response
        return MeasurementResponse(
            success=True,
            message=f"Measurement {measurement_id} updated successfully",
            data=measurement_data,
            id=measurement_id
        )
    
    except HTTPException:
        raise
    except ValidationError as e:
        logger.error(f"Validation error updating measurement {measurement_id}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Validation error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error updating measurement {measurement_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error updating measurement: {str(e)}"
        )

@router.delete("/{measurement_id}", response_model=MeasurementResponse)
async def delete_measurement(measurement_id: str):
    """
    Delete a measurement by ID.
    
    Args:
        measurement_id: The measurement ID
        
    Returns:
        MeasurementResponse: Success response
    """
    try:
        # Check if the measurement exists
        measurement = firestore_service.get_measurement(measurement_id)
        
        if not measurement:
            raise HTTPException(
                status_code=404,
                detail=f"Measurement with ID {measurement_id} not found"
            )
        
        # Delete the measurement
        firestore_service.delete_measurement(measurement_id)
        
        # Return the response
        return MeasurementResponse(
            success=True,
            message=f"Deleted measurement {measurement_id}",
            id=measurement_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting measurement {measurement_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting measurement: {str(e)}"
        )
