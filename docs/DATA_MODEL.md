# Data Model Documentation

This document describes the data model used in the InBody Measurement Tracker application, including the structure of measurement data, validation rules, and how the data is used throughout the application.

## Overview

The application uses a structured data model to represent InBody measurement data. This model is defined using Pydantic schemas in the backend and is used for validation, serialization, and deserialization of data.

## Measurement Data Structure

The core data structure is the `MeasurementData` model, which contains several nested components:

```
MeasurementData
├── informacoes_basicas (Basic Information)
│   ├── nome (Name)
│   ├── id (ID)
│   ├── data_exame (Exam Date)
│   ├── idade (Age)
│   ├── sexo (Gender)
│   └── altura (Height)
│
├── composicao_corporal (Body Composition)
│   ├── peso (Weight)
│   ├── agua_corporal_total (Total Body Water)
│   ├── proteina (Protein)
│   ├── minerais (Minerals)
│   ├── massa_gordura (Fat Mass)
│   ├── massa_muscular_esqueletica (Skeletal Muscle Mass)
│   └── massa_livre_gordura (Fat-Free Mass)
│
├── indices_corporais (Body Indices)
│   ├── imc (BMI)
│   ├── pgc (Body Fat Percentage)
│   ├── taxa_metabolica_basal (Basal Metabolic Rate)
│   ├── relacao_cintura_quadril (Waist-Hip Ratio)
│   ├── nivel_gordura_visceral (Visceral Fat Level)
│   └── grau_obesidade (Obesity Degree)
│
├── analise_segmentar (Segmental Analysis)
│   ├── massa_magra (Lean Mass)
│   │   ├── braco_esquerdo (Left Arm)
│   │   ├── braco_direito (Right Arm)
│   │   ├── tronco (Trunk)
│   │   ├── perna_esquerda (Left Leg)
│   │   └── perna_direita (Right Leg)
│   │
│   └── massa_gorda (Fat Mass)
│       ├── braco_esquerdo (Left Arm)
│       ├── braco_direito (Right Arm)
│       ├── tronco (Trunk)
│       ├── perna_esquerda (Left Leg)
│       └── perna_direita (Right Leg)
│
├── pontuacao_inbody (InBody Score)
├── controle_peso (Weight Control)
│   ├── peso_ideal (Ideal Weight)
│   ├── controle_peso (Weight Control)
│   ├── controle_gordura (Fat Control)
│   └── controle_musculo (Muscle Control)
│
├── modelo_inbody (InBody Model)
├── timestamp (Timestamp)
└── id (Document ID)
```

## Detailed Field Descriptions

### Basic Information (`informacoes_basicas`)

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `nome` | string | Patient's name | Yes | "John Doe" |
| `id` | string | Patient's ID | Yes | "ID12345" |
| `data_exame` | string | Date and time of the exam (ISO format) | Yes | "2025-03-06T14:30:00" |
| `idade` | integer | Patient's age in years | No | 35 |
| `sexo` | string | Patient's gender | No | "Masculino" |
| `altura` | float | Patient's height in cm | No | 175.0 |

### Body Composition (`composicao_corporal`)

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `peso` | float | Total weight in kg | Yes | 75.5 |
| `agua_corporal_total` | float | Total body water in L | No | 45.3 |
| `proteina` | float | Protein in kg | No | 12.8 |
| `minerais` | float | Minerals in kg | No | 4.2 |
| `massa_gordura` | float | Fat mass in kg | Yes | 15.2 |
| `massa_muscular_esqueletica` | float | Skeletal muscle mass in kg | Yes | 35.6 |
| `massa_livre_gordura` | float | Fat-free mass in kg | No | 60.3 |

### Body Indices (`indices_corporais`)

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `imc` | float | Body Mass Index (BMI) in kg/m² | Yes | 24.7 |
| `pgc` | float | Body fat percentage (%) | Yes | 20.1 |
| `taxa_metabolica_basal` | integer | Basal Metabolic Rate in kcal | No | 1750 |
| `relacao_cintura_quadril` | float | Waist-Hip Ratio | No | 0.85 |
| `nivel_gordura_visceral` | integer | Visceral fat level | No | 8 |
| `grau_obesidade` | float | Obesity degree in percentage | No | 112.5 |

### Segmental Analysis (`analise_segmentar`)

#### Lean Mass (`massa_magra`)

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `braco_esquerdo` | float | Left arm lean mass in kg | No | 3.2 |
| `braco_direito` | float | Right arm lean mass in kg | No | 3.3 |
| `tronco` | float | Trunk lean mass in kg | No | 28.5 |
| `perna_esquerda` | float | Left leg lean mass in kg | No | 9.8 |
| `perna_direita` | float | Right leg lean mass in kg | No | 9.9 |

#### Fat Mass (`massa_gorda`)

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `braco_esquerdo` | float | Left arm fat mass in kg | No | 1.1 |
| `braco_direito` | float | Right arm fat mass in kg | No | 1.0 |
| `tronco` | float | Trunk fat mass in kg | No | 8.5 |
| `perna_esquerda` | float | Left leg fat mass in kg | No | 2.3 |
| `perna_direita` | float | Right leg fat mass in kg | No | 2.3 |

### Weight Control (`controle_peso`)

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `peso_ideal` | float | Ideal weight in kg | No | 72.0 |
| `controle_peso` | float | Recommended weight adjustment in kg | No | -3.5 |
| `controle_gordura` | float | Recommended fat adjustment in kg | No | -5.0 |
| `controle_musculo` | float | Recommended muscle adjustment in kg | No | 1.5 |

### Other Fields

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `pontuacao_inbody` | integer | InBody score (0-100) | No | 85 |
| `modelo_inbody` | string | InBody equipment model used | No | "InBody 770" |
| `timestamp` | datetime | Timestamp of data creation | No | "2025-03-06T14:30:00" |
| `id` | string | Document ID in Firestore | No | "abc123def456" |

## Validation Rules

The data model includes several validation rules:

1. **Required Fields**: Fields marked as required must be present and non-null.
2. **Type Validation**: Each field must match its specified type.
3. **Default Values**: Some fields have default values if not provided.

### Example of Validation Logic

When data is extracted from an InBody image, the backend performs validation to ensure the data conforms to the expected structure:

```python
# Ensure required fields are present and not None
if 'informacoes_basicas' in result:
    if result['informacoes_basicas'] is None:
        result['informacoes_basicas'] = {}
    
    # Set default values for required fields if missing or None
    if not result['informacoes_basicas'].get('nome'):
        result['informacoes_basicas']['nome'] = "Unknown Patient"
    if not result['informacoes_basicas'].get('id'):
        result['informacoes_basicas']['id'] = f"ID-{int(time.time())}"
    if not result['informacoes_basicas'].get('data_exame'):
        result['informacoes_basicas']['data_exame'] = datetime.now().isoformat()
else:
    result['informacoes_basicas'] = {
        'nome': "Unknown Patient",
        'id': f"ID-{int(time.time())}",
        'data_exame': datetime.now().isoformat()
    }

# Ensure other required sections are present
if 'composicao_corporal' not in result or result['composicao_corporal'] is None:
    result['composicao_corporal'] = {
        'peso': 70.0,
        'massa_gordura': 15.0,
        'massa_muscular_esqueletica': 30.0
    }

if 'indices_corporais' not in result or result['indices_corporais'] is None:
    result['indices_corporais'] = {
        'imc': 24.0,
        'pgc': 20.0
    }

# Validate the data
MeasurementData.model_validate(result)
```

## Data Storage

The measurement data is stored in Firestore with the following characteristics:

1. **Collection**: The data is stored in a collection specified by the `firestore_collection` environment variable.
2. **Document ID**: Each measurement is stored as a document with a unique ID.
3. **Timestamps**: The `timestamp` field is automatically added if not present.
4. **Indexing**: The data is indexed by the exam date for efficient querying.

## Data Flow

### Data Extraction

1. The user uploads an InBody measurement file.
2. The backend processes the file using Vertex AI Gemini.
3. The extracted data is validated against the `MeasurementData` schema.
4. If validation fails, default values are used for required fields.

### Data Storage

1. The validated data is saved to Firestore.
2. If a document ID is provided, the existing document is updated.
3. If no document ID is provided, a new document is created.
4. The document ID is returned to the frontend.

### Data Retrieval

1. The frontend requests measurements from the backend.
2. The backend retrieves the measurements from Firestore.
3. The measurements are returned to the frontend as a list.
4. The frontend processes the data for display in charts and tables.

## Data Visualization

The data model is used to generate various visualizations:

1. **Weight Chart**: Uses the `peso` field from `composicao_corporal` over time.
2. **Body Composition Pie Chart**: Shows the breakdown of body components from the most recent measurement.
3. **Body Composition Timeline**: Shows how body composition changes over time.
4. **Segmental Analysis Chart**: Displays the distribution of muscle and fat across different body segments.

## Data Editing

Users can edit measurement data through the frontend:

1. The user selects a measurement to edit.
2. The frontend displays the current data in an editor form.
3. The user makes changes to the data.
4. The frontend validates the changes and sends them to the backend.
5. The backend updates the data in Firestore.
6. The frontend refreshes the display with the updated data.

## JSON Schema

The application uses a JSON schema for validation in the Gemini service. This schema is defined in `backend/app/schemas/json.schema` and follows the same structure as the Pydantic models.

## Future Enhancements

Potential enhancements to the data model include:

1. **User Association**: Adding user IDs to associate measurements with specific users.
2. **Measurement Tags**: Adding tags or categories for better organization.
3. **Custom Fields**: Allowing users to add custom fields for additional metrics.
4. **Historical Tracking**: Improved tracking of changes to measurements over time.
5. **Data Export**: Adding functionality to export data in various formats.
