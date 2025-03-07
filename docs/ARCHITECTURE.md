# Architecture Documentation

This document provides a detailed overview of the InBody Measurement Tracker application architecture, explaining how the different components work together.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [Key Components](#key-components)
7. [Integration Points](#integration-points)
8. [Security Considerations](#security-considerations)
9. [Scalability Considerations](#scalability-considerations)

## System Overview

The InBody Measurement Tracker is a full-stack web application that allows users to upload InBody measurement files, extract data using AI, store the data in a database, and visualize the data through interactive charts.

The application consists of two main parts:
1. A Python FastAPI backend that handles file processing, AI integration, and data storage
2. A React frontend that provides the user interface and data visualization

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │                                         │     │                 │
│                 │     │              Backend                    │     │                 │
│                 │     │                                         │     │                 │
│                 │     │  ┌─────────────┐     ┌──────────────┐   │     │                 │
│                 │     │  │             │     │              │   │     │                 │
│    Frontend     │◄────┼──┤  FastAPI    │     │  Gemini      │   │     │  Google Cloud   │
│    (React)      │     │  │  Endpoints  │────►│  Service     │───┼────►│  Vertex AI      │
│                 │────►┼──┤             │     │              │   │     │                 │
│                 │     │  └─────────────┘     └──────────────┘   │     │                 │
│                 │     │         │                   │           │     │                 │
│                 │     │         │                   │           │     └─────────────────┘
│                 │     │         │                   │           │
│                 │     │         ▼                   ▼           │     ┌─────────────────┐
│                 │     │  ┌─────────────┐     ┌──────────────┐   │     │                 │
│                 │     │  │             │     │              │   │     │                 │
│                 │     │  │  Firestore  │     │  File        │   │     │  Google Cloud   │
│                 │     │  │  Service    │     │  Utils       │   │     │  Firestore      │
│                 │     │  │             │     │              │   │     │                 │
│                 │     │  └─────────────┘     └──────────────┘   │     │                 │
│                 │     │         │                               │     │                 │
└─────────────────┘     └─────────┼───────────────────────────────┘     └─────────────────┘
                                  │
                                  ▼
                        ┌─────────────────────┐
                        │                     │
                        │  Firestore Database │
                        │                     │
                        └─────────────────────┘
```

## Backend Architecture

The backend is built with FastAPI, a modern Python web framework that's designed for building APIs with Python 3.7+ based on standard Python type hints.

### Key Components

1. **FastAPI Application (`main.py`)**
   - Entry point for the application
   - Configures middleware (CORS, etc.)
   - Registers routers and endpoints

2. **Routers (`routers/`)**
   - `measurements.py`: Handles measurement-related endpoints
   - Defines API routes and request/response models
   - Orchestrates the flow between services

3. **Services (`services/`)**
   - `gemini_service.py`: Integrates with Vertex AI Gemini for image processing
   - `gemini_client.py`: Client for interacting with the Gemini API
   - `firestore_service.py`: Handles database operations with Firestore

4. **Schemas (`schemas/`)**
   - `measurement.py`: Defines data models using Pydantic
   - `json.schema`: JSON schema for data validation

5. **Utilities (`utils/`)**
   - `file_utils.py`: Helper functions for file operations

### Request Flow

1. Client sends a request to an API endpoint
2. FastAPI router handles the request and validates input
3. Router delegates to appropriate service(s)
4. Services process the request and interact with external systems
5. Response is formatted and returned to the client

## Frontend Architecture

The frontend is built with React, a JavaScript library for building user interfaces, and uses Material UI for styling.

### Key Components

1. **App Component (`App.jsx`)**
   - Main application component
   - Handles routing and layout

2. **Components (`components/`)**
   - `Dashboard.jsx`: Main dashboard view
   - `FileUpload.jsx`: Handles file uploads
   - `MeasurementTable.jsx`: Displays measurement history
   - `MeasurementEditor.jsx`: Allows editing measurements
   - Charts (`charts/`):
     - `WeightChart.jsx`: Displays weight over time
     - `BodyCompositionChart.jsx`: Shows body composition changes
     - `BodyCompositionPieChart.jsx`: Pie chart of body composition
     - `SegmentalAnalysisChart.jsx`: Shows segmental analysis data

3. **Services (`services/`)**
   - `api.js`: Handles API communication with the backend

### Component Hierarchy

```
App
├── Dashboard
│   ├── FileUpload
│   ├── WeightChart
│   ├── BodyCompositionPieChart
│   ├── BodyCompositionChart
│   ├── SegmentalAnalysisChart
│   └── MeasurementTable
└── MeasurementEditor
```

## Data Flow

### File Upload and Processing Flow

1. **File Upload**
   - User uploads an InBody measurement file through the frontend
   - Frontend sends the file to the backend `/api/measurements/upload` endpoint

2. **File Processing**
   - Backend saves the file temporarily
   - `GeminiService` sends the file to Vertex AI Gemini for processing
   - Gemini extracts structured data from the image
   - Data is validated against the schema

3. **Data Storage**
   - Extracted data is saved to Firestore using `FirestoreService`
   - Document ID is returned to the frontend

4. **Data Display**
   - Frontend fetches the processed data
   - Charts and tables are updated to display the new data

### Data Retrieval Flow

1. **Initial Load**
   - Frontend requests all measurements from `/api/measurements`
   - Backend retrieves measurements from Firestore
   - Frontend displays the data in charts and tables

2. **Measurement Updates**
   - User edits a measurement in the frontend
   - Changes are sent to `/api/measurements/{id}` with PUT method
   - Backend updates the record in Firestore
   - Frontend refreshes the display with updated data

## Key Components

### Backend Components

#### GeminiService

The `GeminiService` is responsible for processing InBody measurement images using Vertex AI Gemini.

**Key Functions:**
- `process_inbody_image(file_path)`: Processes an image file and extracts structured data
- `process_inbody_image_base64(base64_image, file_type)`: Processes a base64-encoded image

**Integration Points:**
- Vertex AI Gemini API for image processing
- Pydantic models for data validation

#### FirestoreService

The `FirestoreService` handles all interactions with the Firestore database.

**Key Functions:**
- `save_measurement(measurement_data, doc_id=None)`: Saves or updates a measurement
- `get_all_measurements()`: Retrieves all measurements
- `get_measurement(doc_id)`: Retrieves a specific measurement
- `delete_measurement(doc_id)`: Deletes a measurement

**Integration Points:**
- Google Cloud Firestore for data storage

### Frontend Components

#### FileUpload Component

Handles the file upload process, including drag-and-drop functionality and progress indication.

**Key Features:**
- File selection via button or drag-and-drop
- File type validation
- Upload progress indication
- Success/error feedback

#### Dashboard Component

The main view that displays all charts and the measurement table.

**Key Features:**
- Layout management for charts
- Data fetching and distribution to child components
- State management for selected measurements

#### Chart Components

Various chart components that visualize different aspects of the measurement data.

**Common Features:**
- Data transformation for chart libraries
- Responsive design
- Interactive elements (tooltips, etc.)
- Consistent styling

## Integration Points

### Vertex AI Gemini Integration

The application integrates with Vertex AI Gemini to extract structured data from InBody measurement images.

**Integration Details:**
- Uses the Vertex AI Python SDK
- Sends images to Gemini with specific prompts
- Processes the JSON response
- Validates and transforms the data

**Configuration:**
- Requires a Google Cloud project with Vertex AI API enabled
- Uses application default credentials or a service account

### Firestore Integration

The application uses Google Cloud Firestore as its database.

**Integration Details:**
- Uses the Firestore Python client library
- Stores measurements as documents in a collection
- Queries measurements by date or ID

**Configuration:**
- Requires a Google Cloud project with Firestore enabled
- Collection name is configured via environment variables

## Security Considerations

### Authentication and Authorization

The current implementation does not include user authentication or authorization. For production use, consider implementing:

- User authentication (e.g., Firebase Authentication, OAuth)
- Role-based access control
- API key validation for backend endpoints

### Data Protection

- Sensitive health data should be protected
- Consider encrypting data at rest in Firestore
- Implement proper access controls for Google Cloud resources

### API Security

- Implement rate limiting to prevent abuse
- Add request validation and sanitization
- Use HTTPS for all communications

## Scalability Considerations

### Backend Scalability

- FastAPI can be deployed behind a load balancer
- Consider using asynchronous processing for file uploads
- Implement caching for frequently accessed data

### Database Scalability

- Firestore automatically scales with usage
- Consider implementing pagination for large datasets
- Use efficient queries and indexes

### AI Processing Scalability

- Vertex AI Gemini has usage quotas and rate limits
- Consider implementing a queue for processing large batches of files
- Cache processed results to avoid redundant processing
