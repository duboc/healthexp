# Troubleshooting Guide

This guide provides solutions for common issues you might encounter when using the InBody Measurement Tracker application.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Connection Issues](#connection-issues)
3. [File Upload Issues](#file-upload-issues)
4. [Data Extraction Issues](#data-extraction-issues)
5. [Display and Visualization Issues](#display-and-visualization-issues)
6. [Google Cloud Authentication Issues](#google-cloud-authentication-issues)
7. [Performance Issues](#performance-issues)

## Installation Issues

### Backend Won't Start

**Symptoms:**
- Error messages when running `uvicorn app.main:app --reload`
- Server fails to start

**Possible Solutions:**

1. **Check Python Version**
   ```bash
   python --version
   ```
   Ensure you're using Python 3.8 or higher. If not, install a compatible version.

2. **Verify Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   Make sure all dependencies are correctly installed.

3. **Check Port Availability**
   The default port is 8000. If another application is using this port, you'll get an error.
   ```bash
   # On Linux/Mac
   lsof -i :8000
   
   # On Windows
   netstat -ano | findstr :8000
   ```
   
   If the port is in use, either close the other application or use a different port:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```

4. **Environment Variables**
   Ensure your `.env` file exists and contains the required variables:
   ```
   firestore_collection=your_collection_name
   firestore_database=(default)
   project_id=your_google_cloud_project_id
   ```

### Frontend Won't Start

**Symptoms:**
- Error messages when running `npm start`
- React development server fails to start

**Possible Solutions:**

1. **Check Node.js Version**
   ```bash
   node --version
   ```
   Ensure you're using Node.js v14 or higher.

2. **Clear Node Modules**
   Sometimes, corrupted dependencies can cause issues:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Port Availability**
   The default port is 3000. If another application is using this port, you'll get an error.
   ```bash
   # On Linux/Mac
   lsof -i :3000
   
   # On Windows
   netstat -ano | findstr :3000
   ```
   
   React will usually offer to use a different port automatically if 3000 is in use.

4. **Check for JavaScript Errors**
   Look for syntax errors or other issues in the console output.

## Connection Issues

### Frontend Can't Connect to Backend

**Symptoms:**
- "Network Error" messages in the browser console
- API requests fail
- Data doesn't load

**Possible Solutions:**

1. **Verify Backend is Running**
   Check that the FastAPI server is running and accessible:
   ```bash
   curl http://localhost:8000/health
   ```
   You should receive a response like `{"status":"healthy"}`.

2. **Check CORS Configuration**
   If you're getting CORS errors in the browser console, ensure the backend CORS settings are correct in `backend/app/main.py`.

3. **Check API Base URL**
   Ensure the API base URL in `frontend/src/services/api.js` matches your backend URL:
   ```javascript
   const api = axios.create({
     baseURL: '/api',  // Should match your backend URL
     // ...
   });
   ```

4. **Network Issues**
   - Ensure your firewall isn't blocking connections
   - Check if you're on a restricted network that might block certain ports

## File Upload Issues

### File Upload Fails

**Symptoms:**
- Upload progress stops or fails
- Error messages during upload
- Timeout errors

**Possible Solutions:**

1. **Check File Size**
   Ensure your file is not too large. The recommended maximum is 10MB.

2. **Verify File Format**
   Make sure you're using a supported file format:
   - PNG
   - JPEG/JPG
   - PDF

3. **Check Backend Logs**
   Look at the backend server logs for specific error messages:
   ```bash
   # If running with uvicorn
   # The error should appear in the terminal where uvicorn is running
   ```

4. **Increase Timeout Settings**
   If you're consistently getting timeout errors with large files, you might need to adjust the timeout settings in both the frontend and backend.

### File Uploads But Processing Fails

**Symptoms:**
- File uploads successfully but fails during processing
- Error message about processing failure

**Possible Solutions:**

1. **Check Image Quality**
   - Ensure the image is clear and all text is readable
   - Try scanning the document instead of taking a photo
   - Make sure the entire report is visible in the image

2. **Verify Google Cloud Setup**
   - Ensure your Google Cloud project is correctly set up
   - Verify that Vertex AI API is enabled
   - Check that your service account has the necessary permissions

3. **Check Backend Logs**
   Look for specific error messages in the backend logs related to the Gemini service.

## Data Extraction Issues

### Incorrect or Missing Data

**Symptoms:**
- Some fields are missing after processing
- Data values are incorrect
- Charts display unexpected values

**Possible Solutions:**

1. **Check Image Quality**
   - Ensure the image is clear and all text is readable
   - Make sure there's good lighting and no glare on the report
   - Try using a scanner instead of a camera

2. **Manual Editing**
   Use the measurement editor to manually correct any incorrect or missing data:
   1. Find the measurement in the Measurement Table
   2. Click the "Edit" button
   3. Update the incorrect fields
   4. Save the changes

3. **Check for Format Compatibility**
   The AI is trained on specific InBody report formats. If you're using a very different format or a different body composition analyzer brand, it might not extract data correctly.

## Display and Visualization Issues

### Charts Don't Update

**Symptoms:**
- Charts don't reflect new or edited measurements
- Charts appear empty or incomplete

**Possible Solutions:**

1. **Refresh the Page**
   Sometimes a simple page refresh will resolve display issues.

2. **Clear Browser Cache**
   ```
   # Chrome
   Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
   
   # Firefox
   Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
   
   # Safari
   Cmd+Option+E
   ```

3. **Check Console for Errors**
   Open your browser's developer tools (F12 or Right-click > Inspect) and check the console for any JavaScript errors.

4. **Verify Data Format**
   Ensure the measurement data is in the correct format. If you've manually edited data, make sure all required fields have valid values.

### Responsive Design Issues

**Symptoms:**
- UI elements overlap or display incorrectly on mobile devices
- Charts are cut off or too small

**Possible Solutions:**

1. **Try a Different Browser**
   Some browsers handle responsive layouts better than others.

2. **Adjust Zoom Level**
   Try adjusting your browser's zoom level (Ctrl+/- or Cmd+/-).

3. **Landscape Orientation**
   On mobile devices, try rotating to landscape orientation for better chart visibility.

## Google Cloud Authentication Issues

### Authentication Failures

**Symptoms:**
- Error messages about authentication
- "Permission denied" errors
- Firestore operations fail

**Possible Solutions:**

1. **Check Environment Variables**
   Ensure your Google Cloud project ID is correctly set in the `.env` file:
   ```
   project_id=your_google_cloud_project_id
   ```

2. **Verify Service Account Key**
   If using a service account key file:
   - Ensure the file exists and is readable
   - Verify the environment variable is correctly set:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
     ```

3. **Check Service Account Permissions**
   Ensure your service account has the necessary permissions:
   - Vertex AI User
   - Firestore User
   - Storage Object Viewer (if using Cloud Storage)

4. **Application Default Credentials**
   If using application default credentials:
   ```bash
   gcloud auth application-default login
   ```
   Ensure you're logged in with an account that has access to the project.

## Performance Issues

### Slow Application Performance

**Symptoms:**
- Application takes a long time to load
- Operations are sluggish
- File processing is very slow

**Possible Solutions:**

1. **Check Network Speed**
   Slow internet connection can affect application performance, especially when uploading files or retrieving data.

2. **Optimize Image Size**
   If you're uploading large image files, try compressing them first:
   - Use image compression tools
   - Reduce resolution (while keeping text readable)
   - Convert to more efficient formats

3. **Browser Performance**
   - Close unused tabs and applications
   - Clear browser cache and cookies
   - Try a different browser

4. **Check System Resources**
   - Ensure your computer has sufficient memory
   - Close resource-intensive applications

### Database Performance Issues

**Symptoms:**
- Retrieving measurements is slow
- Adding or updating measurements takes a long time

**Possible Solutions:**

1. **Check Firestore Indexes**
   If you have a large number of measurements, you might need to create indexes for better query performance.

2. **Optimize Queries**
   If you've modified the code, ensure your Firestore queries are optimized.

3. **Check Google Cloud Console**
   Look at the Firestore monitoring in Google Cloud Console to identify any performance bottlenecks.

## Still Having Issues?

If you've tried the solutions above and are still experiencing problems:

1. **Check for Updates**
   Ensure you're using the latest version of the application.

2. **Review Logs**
   Check both frontend and backend logs for error messages or warnings.

3. **Contact Support**
   Reach out to the development team with:
   - Detailed description of the issue
   - Steps to reproduce the problem
   - Error messages (if any)
   - Screenshots (if applicable)
   - System information (browser, OS, etc.)
