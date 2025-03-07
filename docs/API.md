# API Documentation

This document provides detailed information about the InBody Measurement Tracker API endpoints, request/response formats, and error handling.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:8000/api
```

## Authentication

Currently, the API does not implement authentication. This is suitable for local development but should be enhanced with proper authentication for production use.

## Common Response Format

Most API responses follow this common format:

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": { ... },
  "id": "optional-document-id"
}
```

For error responses:

```json
{
  "detail": "Error message describing what went wrong"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - The request was malformed or contains invalid parameters |
| 404 | Not Found - The requested resource was not found |
| 500 | Internal Server Error - Something went wrong on the server |

## Endpoints

### Upload Measurement File

Upload and process an InBody measurement file.

**URL**: `/measurements/upload`

**Method**: `POST`

**Content-Type**: `multipart/form-data`

**Request Body**:
- `file`: The InBody measurement file (PNG, PDF, JPEG)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Measurement processed and saved successfully",
  "data": {
    "informacoes_basicas": {
      "nome": "John Doe",
      "id": "ID12345",
      "data_exame": "2025-03-06T14:30:00",
      "idade": 35,
      "sexo": "Masculino",
      "altura": 175.0
    },
    "composicao_corporal": {
      "peso": 75.5,
      "agua_corporal_total": 45.3,
      "proteina": 12.8,
      "minerais": 4.2,
      "massa_gordura": 15.2,
      "massa_muscular_esqueletica": 35.6,
      "massa_livre_gordura": 60.3
    },
    "indices_corporais": {
      "imc": 24.7,
      "pgc": 20.1,
      "taxa_metabolica_basal": 1750,
      "relacao_cintura_quadril": 0.85,
      "nivel_gordura_visceral": 8,
      "grau_obesidade": 112.5
    },
    "analise_segmentar": {
      "massa_magra": {
        "braco_esquerdo": 3.2,
        "braco_direito": 3.3,
        "tronco": 28.5,
        "perna_esquerda": 9.8,
        "perna_direita": 9.9
      },
      "massa_gorda": {
        "braco_esquerdo": 1.1,
        "braco_direito": 1.0,
        "tronco": 8.5,
        "perna_esquerda": 2.3,
        "perna_direita": 2.3
      }
    },
    "pontuacao_inbody": 85,
    "controle_peso": {
      "peso_ideal": 72.0,
      "controle_peso": -3.5,
      "controle_gordura": -5.0,
      "controle_musculo": 1.5
    },
    "modelo_inbody": "InBody 770"
  },
  "id": "abc123def456"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{"detail": "File type not allowed. Allowed types: jpg, jpeg, png, pdf"}`
- **Code**: 500 Internal Server Error
  - **Content**: `{"detail": "Error processing measurement file: [error message]"}`

### Upload Base64 File

Upload and process a base64-encoded InBody measurement file.

**URL**: `/measurements/upload-base64`

**Method**: `POST`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "file_data": "base64-encoded-string",
  "file_name": "inbody_report.jpg",
  "file_type": "jpeg"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**: Same as the upload endpoint

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{"detail": "Could not determine file type. Please provide file_type."}`
- **Code**: 500 Internal Server Error
  - **Content**: `{"detail": "Error processing base64 measurement file: [error message]"}`

### Get All Measurements

Get all measurements, ordered by date.

**URL**: `/measurements`

**Method**: `GET`

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Retrieved 3 measurements",
  "data": [
    {
      "informacoes_basicas": { ... },
      "composicao_corporal": { ... },
      "indices_corporais": { ... },
      "analise_segmentar": { ... },
      "pontuacao_inbody": 85,
      "controle_peso": { ... },
      "modelo_inbody": "InBody 770",
      "id": "abc123def456"
    },
    { ... },
    { ... }
  ]
}
```

**Error Response**:
- **Code**: 500 Internal Server Error
  - **Content**: `{"detail": "Error getting measurements: [error message]"}`

### Get Measurement by ID

Get a specific measurement by ID.

**URL**: `/measurements/{measurement_id}`

**Method**: `GET`

**URL Parameters**:
- `measurement_id`: The ID of the measurement to retrieve

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Retrieved measurement abc123def456",
  "data": {
    "informacoes_basicas": { ... },
    "composicao_corporal": { ... },
    "indices_corporais": { ... },
    "analise_segmentar": { ... },
    "pontuacao_inbody": 85,
    "controle_peso": { ... },
    "modelo_inbody": "InBody 770"
  },
  "id": "abc123def456"
}
```

**Error Responses**:
- **Code**: 404 Not Found
  - **Content**: `{"detail": "Measurement with ID abc123def456 not found"}`
- **Code**: 500 Internal Server Error
  - **Content**: `{"detail": "Error getting measurement: [error message]"}`

### Update Measurement

Update a measurement by ID.

**URL**: `/measurements/{measurement_id}`

**Method**: `PUT`

**Content-Type**: `application/json`

**URL Parameters**:
- `measurement_id`: The ID of the measurement to update

**Request Body**:
```json
{
  "informacoes_basicas": {
    "nome": "John Doe",
    "id": "ID12345",
    "data_exame": "2025-03-06T14:30:00",
    "idade": 35,
    "sexo": "Masculino",
    "altura": 175.0
  },
  "composicao_corporal": {
    "peso": 75.5,
    "agua_corporal_total": 45.3,
    "proteina": 12.8,
    "minerais": 4.2,
    "massa_gordura": 15.2,
    "massa_muscular_esqueletica": 35.6,
    "massa_livre_gordura": 60.3
  },
  "indices_corporais": {
    "imc": 24.7,
    "pgc": 20.1,
    "taxa_metabolica_basal": 1750,
    "relacao_cintura_quadril": 0.85,
    "nivel_gordura_visceral": 8,
    "grau_obesidade": 112.5
  }
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Measurement abc123def456 updated successfully",
  "data": { ... },
  "id": "abc123def456"
}
```

**Error Responses**:
- **Code**: 404 Not Found
  - **Content**: `{"detail": "Measurement with ID abc123def456 not found"}`
- **Code**: 400 Bad Request
  - **Content**: `{"detail": "Validation error: [error message]"}`
- **Code**: 500 Internal Server Error
  - **Content**: `{"detail": "Error updating measurement: [error message]"}`

### Delete Measurement

Delete a measurement by ID.

**URL**: `/measurements/{measurement_id}`

**Method**: `DELETE`

**URL Parameters**:
- `measurement_id`: The ID of the measurement to delete

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Deleted measurement abc123def456",
  "id": "abc123def456"
}
```

**Error Responses**:
- **Code**: 404 Not Found
  - **Content**: `{"detail": "Measurement with ID abc123def456 not found"}`
- **Code**: 500 Internal Server Error
  - **Content**: `{"detail": "Error deleting measurement: [error message]"}`

## Data Models

### Measurement Data Structure

The measurement data follows this structure:

```json
{
  "informacoes_basicas": {
    "nome": "string",
    "id": "string",
    "data_exame": "string (ISO date format)",
    "idade": "integer",
    "sexo": "string",
    "altura": "float"
  },
  "composicao_corporal": {
    "peso": "float",
    "agua_corporal_total": "float",
    "proteina": "float",
    "minerais": "float",
    "massa_gordura": "float",
    "massa_muscular_esqueletica": "float",
    "massa_livre_gordura": "float"
  },
  "indices_corporais": {
    "imc": "float",
    "pgc": "float",
    "taxa_metabolica_basal": "integer",
    "relacao_cintura_quadril": "float",
    "nivel_gordura_visceral": "integer",
    "grau_obesidade": "float"
  },
  "analise_segmentar": {
    "massa_magra": {
      "braco_esquerdo": "float",
      "braco_direito": "float",
      "tronco": "float",
      "perna_esquerda": "float",
      "perna_direita": "float"
    },
    "massa_gorda": {
      "braco_esquerdo": "float",
      "braco_direito": "float",
      "tronco": "float",
      "perna_esquerda": "float",
      "perna_direita": "float"
    }
  },
  "pontuacao_inbody": "integer",
  "controle_peso": {
    "peso_ideal": "float",
    "controle_peso": "float",
    "controle_gordura": "float",
    "controle_musculo": "float"
  },
  "modelo_inbody": "string",
  "timestamp": "string (ISO date format)",
  "id": "string"
}
```

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting to prevent abuse.

## Versioning

The current API version is v1. The version is not included in the URL path but is specified in the FastAPI app metadata.

## Future Enhancements

Planned API enhancements:
- Authentication and authorization
- Rate limiting
- Pagination for large result sets
- Filtering and sorting options
- Bulk operations
