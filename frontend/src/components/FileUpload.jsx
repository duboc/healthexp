import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import apiService from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    // Only accept one file
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.uploadFile(file);
      
      if (response.data.success) {
        setSuccess(true);
        setFile(null);
        
        // Call the callback function with the measurement data
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file read as base64
  const handleFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract the base64 data from the result
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle base64 upload
  const handleBase64Upload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Read file as base64
      const base64Data = await handleFileAsBase64(file);
      
      // Get file type from file name
      const fileType = file.name.split('.').pop().toLowerCase();
      
      // Upload base64 data
      const response = await apiService.uploadBase64File(
        base64Data,
        file.name,
        fileType
      );
      
      if (response.data.success) {
        setSuccess(true);
        setFile(null);
        
        // Call the callback function with the measurement data
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload InBody Measurement
      </Typography>
      
      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          p: 4,
          mb: 2,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          
          {isDragActive ? (
            <Typography variant="body1">Drop the file here...</Typography>
          ) : (
            <>
              <Typography variant="body1" align="center">
                Drag and drop your InBody measurement file here, or click to select a file
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Supported formats: JPG, JPEG, PNG, PDF
              </Typography>
            </>
          )}
          
          {file && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 1 }}>
              <Typography variant="body2">
                Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : 'Upload and Process'}
        </Button>
      </Stack>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          File uploaded and processed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
