import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
const apiService = {
  /**
   * Upload a file to the server
   * @param {File} file - The file to upload
   * @returns {Promise} - The response from the server
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/measurements/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  /**
   * Upload a base64-encoded file to the server
   * @param {string} fileData - Base64-encoded file data
   * @param {string} fileName - Original file name
   * @param {string} fileType - File type (e.g., 'jpeg', 'png', 'pdf')
   * @returns {Promise} - The response from the server
   */
  uploadBase64File: async (fileData, fileName, fileType) => {
    return api.post('/measurements/upload-base64', {
      file_data: fileData,
      file_name: fileName,
      file_type: fileType,
    });
  },
  
  /**
   * Get all measurements
   * @returns {Promise} - The response from the server
   */
  getAllMeasurements: async () => {
    return api.get('/measurements');
  },
  
  /**
   * Get a specific measurement by ID
   * @param {string} id - The measurement ID
   * @returns {Promise} - The response from the server
   */
  getMeasurement: async (id) => {
    return api.get(`/measurements/${id}`);
  },
  
  /**
   * Delete a measurement by ID
   * @param {string} id - The measurement ID
   * @returns {Promise} - The response from the server
   */
  deleteMeasurement: async (id) => {
    return api.delete(`/measurements/${id}`);
  },
  
  /**
   * Update a measurement by ID
   * @param {string} id - The measurement ID
   * @param {object} data - The updated measurement data
   * @returns {Promise} - The response from the server
   */
  updateMeasurement: async (id, data) => {
    return api.put(`/measurements/${id}`, data);
  },
};

export default apiService;
