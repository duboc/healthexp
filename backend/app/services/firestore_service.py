from google.cloud import firestore
import os
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class FirestoreService:
    """Service for interacting with Firestore database."""
    
    def __init__(self):
        """Initialize the Firestore client."""
        self.project_id = os.getenv('project_id')
        self.collection_name = os.getenv('firestore_collection')
        self.db = firestore.Client(project=self.project_id)
        self.collection = self.db.collection(self.collection_name)
        logger.info(f"Initialized Firestore service with collection: {self.collection_name}")
    
    def save_measurement(self, measurement_data, doc_id=None):
        """
        Save measurement data to Firestore.
        
        Args:
            measurement_data (dict): The measurement data to save
            doc_id (str, optional): The document ID to update. If None, a new document is created.
            
        Returns:
            str: The document ID of the saved measurement
        """
        try:
            # Add timestamp if not present
            if 'timestamp' not in measurement_data:
                measurement_data['timestamp'] = datetime.now()
            
            if doc_id:
                # Update existing document
                doc_ref = self.collection.document(doc_id)
                doc_ref.set(measurement_data, merge=True)
                logger.info(f"Updated measurement with ID: {doc_id}")
                return doc_id
            else:
                # Add new document to collection
                doc_ref = self.collection.document()
                doc_ref.set(measurement_data)
                logger.info(f"Saved new measurement with ID: {doc_ref.id}")
                return doc_ref.id
        except Exception as e:
            logger.error(f"Error saving measurement: {str(e)}")
            raise
    
    def get_all_measurements(self):
        """
        Get all measurements, ordered by date.
        
        Returns:
            list: List of measurement dictionaries
        """
        try:
            # Get all documents ordered by date
            query = self.collection.order_by('informacoes_basicas.data_exame')
            docs = query.stream()
            
            # Convert to list of dictionaries with ID
            measurements = []
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                measurements.append(data)
                
            logger.info(f"Retrieved {len(measurements)} measurements")
            return measurements
        except Exception as e:
            logger.error(f"Error getting measurements: {str(e)}")
            raise
    
    def get_measurement(self, doc_id):
        """
        Get a specific measurement by ID.
        
        Args:
            doc_id (str): The document ID
            
        Returns:
            dict: The measurement data or None if not found
        """
        try:
            doc_ref = self.collection.document(doc_id)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                data['id'] = doc.id
                return data
            else:
                logger.warning(f"Measurement with ID {doc_id} not found")
                return None
        except Exception as e:
            logger.error(f"Error getting measurement {doc_id}: {str(e)}")
            raise
    
    def delete_measurement(self, doc_id):
        """
        Delete a measurement by ID.
        
        Args:
            doc_id (str): The document ID
            
        Returns:
            bool: True if deleted successfully
        """
        try:
            doc_ref = self.collection.document(doc_id)
            doc_ref.delete()
            logger.info(f"Deleted measurement with ID: {doc_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting measurement {doc_id}: {str(e)}")
            raise
