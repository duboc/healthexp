# InBody Measurement Tracker

![InBody Measurement Tracker](https://i.imgur.com/placeholder-image.png)

An application that uses React and a Python API to allow users to upload InBody scale measurement files (PNG, PDF, JPEG). The application uses Vertex AI with Gemini Flash 2.0 to extract information from the files and stores the data in Firestore. The data is then visualized to show the user's body composition evolution over time.

## What is InBody?

InBody is a brand of body composition analyzers that provide detailed measurements of body composition, including weight, body fat percentage, muscle mass, and other metrics. These devices are commonly used in fitness centers, clinics, and hospitals to track body composition changes over time.

This application helps users digitize and track their InBody measurement results by extracting data from scanned reports and providing visualizations to monitor progress.

## Features

- Upload InBody measurement files (PNG, PDF, JPEG)
- Extract structured data using Vertex AI Gemini Flash 2.0
- Store measurement data in Firestore
- Visualize body composition evolution with interactive charts:
  - Weight progression
  - Body composition breakdown (fat, muscle, water)
  - Segmental analysis (arms, trunk, legs)
- View and manage measurement history
- Edit measurement data manually if needed

## Project Structure

The project consists of two main parts:

1. **Backend (Python FastAPI)**
   - Handles file uploads and processing
   - Integrates with Vertex AI Gemini for AI-powered data extraction
   - Manages Firestore storage for persistent data
   - Provides RESTful API endpoints for frontend communication

2. **Frontend (React with Material UI)**
   - User-friendly interface for file uploads
   - Interactive data visualization with Chart.js
   - Measurement history management
   - Responsive design for desktop and mobile use

### Directory Structure

```
/
├── backend/                  # Python FastAPI backend
│   ├── app/                  # Application code
│   │   ├── main.py           # Main application entry point
│   │   ├── routers/          # API route definitions
│   │   ├── schemas/          # Data models and validation
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Utility functions
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   │   └── charts/       # Chart components
│   │   ├── services/         # API service layer
│   │   └── App.jsx           # Main application component
│   ├── package.json          # Node.js dependencies
│   └── webpack.config.js     # Webpack configuration
│
├── .env.example              # Example environment variables
├── README.md                 # Project documentation
├── start-app.sh              # Startup script for Unix/Mac
└── start-app.bat             # Startup script for Windows
```

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Google Cloud Platform account with:
  - Vertex AI API enabled
  - Firestore database
  - Service account with appropriate permissions

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inbody-measurement-tracker.git
   cd inbody-measurement-tracker
   ```

2. Set up environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your Google Cloud settings:
   ```
   firestore_collection=your_collection_name
   firestore_database=(default)
   project_id=your_google_cloud_project_id
   ```

4. Set up Google Cloud authentication:

   **Option 1: Using a service account key file (development)**
   
   - Create a service account in the Google Cloud Console
   - Generate a JSON key file for the service account
   - Set the GOOGLE_APPLICATION_CREDENTIALS environment variable:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
     ```
     
   **Option 2: Using application default credentials (recommended for production)**
   
   - Install the Google Cloud SDK
   - Run `gcloud auth application-default login`

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000

### Using the Startup Scripts

For convenience, you can use the provided startup scripts:

- On Unix/Mac:
  ```bash
  ./start-app.sh
  ```

- On Windows:
  ```bash
  start-app.bat
  ```

These scripts will start both the backend and frontend servers.

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the file upload component to upload an InBody measurement file
   - Supported formats: PNG, PDF, JPEG
   - The file should contain a clear image of an InBody measurement report
3. The application will process the file and extract the data using AI
   - This may take a few seconds depending on the file size and complexity
4. Once processed, you'll see your body composition data in the interactive charts
5. Add more measurements over time to track your progress
6. Use the measurement table to view, edit, or delete your measurement history

### Example Workflow

1. **Upload a measurement file**:
   - Click the "Upload" button or drag and drop a file
   - The system will process the file and extract the data

2. **View your data**:
   - The dashboard will display charts showing your body composition
   - Weight chart shows your weight progression over time
   - Body composition charts show the breakdown of fat, muscle, and other components
   - Segmental analysis shows the distribution across different body parts

3. **Manage measurements**:
   - Use the measurement table to view all your measurements
   - Edit a measurement if you need to correct any data
   - Delete measurements you no longer want to track

## API Endpoints

The backend provides the following RESTful API endpoints:

### Measurement Endpoints

- `POST /api/measurements/upload`: Upload and process a file
  - Request: `multipart/form-data` with a file field
  - Response: Processed measurement data and document ID

- `POST /api/measurements/upload-base64`: Upload and process a base64-encoded file
  - Request: JSON with `file_data`, `file_name`, and optional `file_type`
  - Response: Processed measurement data and document ID

- `GET /api/measurements`: Get all measurements
  - Response: List of all measurements ordered by date

- `GET /api/measurements/{id}`: Get a specific measurement
  - Response: Measurement data for the specified ID

- `PUT /api/measurements/{id}`: Update a measurement
  - Request: JSON with updated measurement data
  - Response: Updated measurement data

- `DELETE /api/measurements/{id}`: Delete a measurement
  - Response: Success confirmation

### Health Check Endpoints

- `GET /`: Root endpoint to check if the API is running
- `GET /health`: Health check endpoint

## Documentation

Comprehensive documentation is available in the [docs](docs) directory:

- [**User Guide**](docs/USER_GUIDE.md) - How to use the application
- [**API Documentation**](docs/API.md) - Detailed API reference
- [**Troubleshooting Guide**](docs/TROUBLESHOOTING.md) - Solutions for common issues
- [**Architecture Documentation**](docs/ARCHITECTURE.md) - System architecture overview
- [**Data Model Documentation**](docs/DATA_MODEL.md) - Data structure and validation
- [**Environment Variables**](docs/ENVIRONMENT_VARIABLES.md) - Configuration guide
- [**Contributing Guidelines**](docs/CONTRIBUTING.md) - How to contribute

See the [documentation index](docs/README.md) for a complete list of available documentation.

## Technologies Used

### Backend

- **FastAPI**: Modern, fast web framework for building APIs with Python
- **Vertex AI (Gemini Flash 2.0)**: Google's multimodal AI model for extracting data from images
- **Google Cloud Firestore**: NoSQL document database for storing measurement data
- **Pydantic**: Data validation and settings management
- **Python 3.8+**: Core programming language

### Frontend

- **React**: JavaScript library for building user interfaces
- **Material UI**: React component library implementing Google's Material Design
- **Chart.js**: JavaScript charting library for data visualization
- **Axios**: Promise-based HTTP client for making API requests
- **Webpack**: Module bundler for JavaScript applications

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure both backend and frontend servers are running
   - Check that the API base URL in the frontend matches the backend URL
   - Verify network connectivity between frontend and backend

2. **File Upload Issues**
   - Ensure the file is in a supported format (PNG, PDF, JPEG)
   - Check that the file size is not too large (max 10MB)
   - Verify that the file contains a clear image of an InBody report

3. **Google Cloud Authentication**
   - Verify that your Google Cloud credentials are correctly set up
   - Ensure the service account has the necessary permissions
   - Check that the project ID in the .env file matches your Google Cloud project

4. **Data Extraction Issues**
   - Ensure the image is clear and all text is readable
   - Check that the Vertex AI API is enabled in your Google Cloud project
   - Verify that your service account has access to Vertex AI

For more troubleshooting information, see the [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For more information, see the [Contributing Guidelines](docs/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- InBody for their body composition analysis technology
- Google Cloud for Vertex AI and Firestore services
- The open-source community for the various libraries used in this project
