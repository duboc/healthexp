from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List, Any, Union
from datetime import datetime

class FileUpload(BaseModel):
    """Schema for file upload request."""
    file_data: str = Field(..., description="Base64-encoded file data")
    file_name: str = Field(..., description="Original filename")
    file_type: Optional[str] = Field(None, description="File type (e.g., 'jpeg', 'png', 'pdf')")

class SegmentalMass(BaseModel):
    """Schema for segmental mass data."""
    braco_esquerdo: Optional[float] = Field(None, description="Left arm mass in kg")
    braco_direito: Optional[float] = Field(None, description="Right arm mass in kg")
    tronco: Optional[float] = Field(None, description="Trunk mass in kg")
    perna_esquerda: Optional[float] = Field(None, description="Left leg mass in kg")
    perna_direita: Optional[float] = Field(None, description="Right leg mass in kg")

class AnaliseSegmentar(BaseModel):
    """Schema for segmental analysis data."""
    massa_magra: Optional[SegmentalMass] = Field(None, description="Lean mass by segment")
    massa_gorda: Optional[SegmentalMass] = Field(None, description="Fat mass by segment")

class InformacoesBasicas(BaseModel):
    """Schema for basic information."""
    nome: str = Field(..., description="Patient name")
    id: str = Field(..., description="Patient ID")
    data_exame: str = Field(..., description="Exam date and time")
    idade: Optional[int] = Field(None, description="Patient age in years")
    sexo: Optional[str] = Field(None, description="Patient gender")
    altura: Optional[float] = Field(None, description="Patient height in cm")

class ComposicaoCorporal(BaseModel):
    """Schema for body composition data."""
    peso: float = Field(..., description="Total weight in kg")
    agua_corporal_total: Optional[float] = Field(None, description="Total body water in L")
    proteina: Optional[float] = Field(None, description="Protein in kg")
    minerais: Optional[float] = Field(None, description="Minerals in kg")
    massa_gordura: float = Field(..., description="Fat mass in kg")
    massa_muscular_esqueletica: float = Field(..., description="Skeletal muscle mass in kg")
    massa_livre_gordura: Optional[float] = Field(None, description="Fat-free mass in kg")

class IndicesCorporais(BaseModel):
    """Schema for body indices data."""
    imc: float = Field(..., description="Body Mass Index (BMI) in kg/m²")
    pgc: float = Field(..., description="Body fat percentage (%)")
    taxa_metabolica_basal: Optional[int] = Field(None, description="Basal Metabolic Rate in kcal")
    relacao_cintura_quadril: Optional[float] = Field(None, description="Waist-Hip Ratio")
    nivel_gordura_visceral: Optional[int] = Field(None, description="Visceral fat level")
    grau_obesidade: Optional[float] = Field(None, description="Obesity degree in percentage")

class ControlePeso(BaseModel):
    """Schema for weight control recommendations."""
    peso_ideal: Optional[float] = Field(None, description="Ideal weight in kg")
    controle_peso: Optional[float] = Field(None, description="Recommended weight adjustment in kg")
    controle_gordura: Optional[float] = Field(None, description="Recommended fat adjustment in kg")
    controle_musculo: Optional[float] = Field(None, description="Recommended muscle adjustment in kg")

class MeasurementData(BaseModel):
    """Schema for complete measurement data."""
    informacoes_basicas: InformacoesBasicas
    composicao_corporal: ComposicaoCorporal
    indices_corporais: IndicesCorporais
    analise_segmentar: Optional[AnaliseSegmentar] = Field(None)
    pontuacao_inbody: Optional[int] = Field(None, description="InBody score (0-100)")
    controle_peso: Optional[ControlePeso] = Field(None)
    modelo_inbody: Optional[str] = Field(None, description="InBody equipment model used")
    timestamp: Optional[datetime] = Field(None, description="Timestamp of data creation")
    id: Optional[str] = Field(None, description="Document ID in Firestore")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class MeasurementResponse(BaseModel):
    """Schema for measurement response."""
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Response message")
    data: Optional[MeasurementData] = Field(None, description="Measurement data")
    id: Optional[str] = Field(None, description="Document ID in Firestore")

class MeasurementsListResponse(BaseModel):
    """Schema for list of measurements response."""
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Response message")
    data: List[MeasurementData] = Field([], description="List of measurement data")
