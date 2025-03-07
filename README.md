# InBody Measurement Tracker

An application that uses React and a Python API to allow users to upload InBody scale measurement files (PNG, PDF, JPEG). The application uses Vertex AI with Gemini Flash 2.0 to extract information from the files and stores the data in Firestore. The data is then visualized to show the user's body composition evolution over time.

## Features

- Upload InBody measurement files (PNG, PDF, JPEG)
- Extract structured data using Vertex AI Gemini Flash 2.0
- Store measurement data in Firestore
- Visualize body composition evolution with interactive charts:
  - Weight progression
  - Body composition breakdown
  - Segmental analysis
- View and manage measurement history

## Project Structure

The project consists of two main parts:

1. **Backend (Python FastAPI)**
   - Handles file uploads and processing
   - Integrates with Vertex AI Gemini
   - Manages Firestore storage
   - Provides RESTful API endpoints

2. **Frontend (React with Material UI)**
   - User-friendly interface for file uploads
   - Interactive data visualization
   - Measurement history management

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Google Cloud Platform account with:
  - Vertex AI API enabled
  - Firestore database
  - Service account with appropriate permissions

## Environment Setup

1. Set up environment variables in `.env`:
   ```
   firestore_collection=vem_monstro
   firestore_database=(default)
   project_id=conventodapenha
   ```

2. Ensure you have Google Cloud credentials set up for authentication.

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

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

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the file upload component to upload an InBody measurement file
3. The application will process the file and extract the data
4. View your body composition data in the interactive charts
5. Track your progress over time as you add more measurements

## API Endpoints

- `POST /api/measurements/upload`: Upload and process a file
- `POST /api/measurements/upload-base64`: Upload and process a base64-encoded file
- `GET /api/measurements`: Get all measurements
- `GET /api/measurements/{id}`: Get a specific measurement
- `DELETE /api/measurements/{id}`: Delete a measurement

## Technologies Used

- **Backend**:
  - FastAPI
  - Vertex AI (Gemini Flash 2.0)
  - Google Cloud Firestore
  - Python

- **Frontend**:
  - React
  - Material UI
  - Chart.js
  - Axios

## License

This project is licensed under the MIT License - see the LICENSE file for details.
