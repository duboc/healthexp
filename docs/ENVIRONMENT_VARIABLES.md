# Environment Variables

This document describes all environment variables used in the InBody Measurement Tracker application, their purpose, and how to configure them.

## Overview

Environment variables are used to configure the application without changing the code. They allow for different configurations in development, testing, and production environments.

## Backend Environment Variables

These variables are used by the Python FastAPI backend and should be set in the `.env` file in the root directory.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `project_id` | Google Cloud project ID | `your-project-id` |
| `firestore_collection` | Firestore collection name for storing measurements | `inbody_measurements` |
| `firestore_database` | Firestore database name (usually `(default)`) | `(default)` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `LOG_LEVEL` | Logging level | `INFO` | `DEBUG` |
| `PORT` | Port for the FastAPI server | `8000` | `8080` |
| `HOST` | Host for the FastAPI server | `0.0.0.0` | `127.0.0.1` |

## Frontend Environment Variables

These variables are used by the React frontend and should be set in the `.env` file in the `frontend` directory.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL of the backend API | `http://localhost:8000/api` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `REACT_APP_MAX_FILE_SIZE` | Maximum file size in bytes | `10485760` (10MB) | `5242880` (5MB) |
| `REACT_APP_DEBUG` | Enable debug mode | `false` | `true` |

## Google Cloud Authentication

The application requires authentication with Google Cloud to access Vertex AI and Firestore. There are two main ways to set this up:

### Option 1: Service Account Key (Development)

1. Create a service account in the Google Cloud Console
2. Generate a JSON key file for the service account
3. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of the key file:

```bash
# Linux/Mac
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"

# Windows (Command Prompt)
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your-service-account-key.json

# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your-service-account-key.json"
```

### Option 2: Application Default Credentials (Recommended for Production)

1. Install the Google Cloud SDK
2. Run `gcloud auth application-default login`
3. Follow the authentication flow in your browser

## Environment Variable Files

The project uses several environment variable files:

1. `.env`: Main environment file for backend configuration
2. `.env.example`: Example file showing required variables
3. `frontend/.env`: Environment variables for the frontend
4. `frontend/.env.development`: Development-specific frontend variables

## Setting Up Environment Variables

### Development Setup

1. Copy the example file to create your own:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific values:
   ```
   project_id=your-project-id
   firestore_collection=your_collection_name
   firestore_database=(default)
   ```

3. For the frontend, create a `.env` file in the `frontend` directory:
   ```bash
   cd frontend
   cp .env.development .env
   ```

4. Edit the frontend `.env` file with your specific values:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

### Production Setup

For production environments, it's recommended to:

1. Use environment variables provided by your hosting platform
2. Use application default credentials for Google Cloud authentication
3. Set more restrictive CORS settings
4. Use HTTPS for all communications

## Troubleshooting

### Common Issues

1. **"Could not find credentials" error**
   - Ensure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
   - Verify the service account key file exists and is readable
   - Check that the service account has the necessary permissions

2. **"Project not found" error**
   - Verify the `project_id` in your `.env` file
   - Ensure the project exists in Google Cloud
   - Check that your credentials have access to the project

3. **"Collection not found" error**
   - Verify the `firestore_collection` in your `.env` file
   - The collection will be created automatically if it doesn't exist
   - Check Firestore permissions

4. **Frontend can't connect to backend**
   - Verify the `REACT_APP_API_URL` in your frontend `.env` file
   - Ensure the backend is running and accessible
   - Check for CORS issues in the browser console

## Security Considerations

- **Never commit `.env` files to version control**
- Use different service accounts for development and production
- Limit service account permissions to only what's needed
- Rotate service account keys regularly
- Consider using a secrets management solution for production
