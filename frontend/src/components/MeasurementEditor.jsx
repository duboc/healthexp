import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import apiService from '../services/api';

const MeasurementEditor = ({ measurement, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Initialize form data when measurement changes
  useEffect(() => {
    if (measurement) {
      setFormData(JSON.parse(JSON.stringify(measurement))); // Deep copy
      setError(null);
      setSuccess(false);
    }
  }, [measurement]);

  // Handle form field changes
  const handleChange = (section, field, value) => {
    if (!formData) return;

    // Create a deep copy of the form data
    const updatedData = { ...formData };

    // Ensure the section exists
    if (!updatedData[section]) {
      updatedData[section] = {};
    }

    // Update the field
    updatedData[section][field] = value;

    // Update state
    setFormData(updatedData);
  };

  // Handle numeric input changes
  const handleNumericChange = (section, field, value) => {
    // Convert to number or keep as empty string
    const numericValue = value === '' ? '' : Number(value);
    handleChange(section, field, numericValue);
  };

  // Handle save button click
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiService.updateMeasurement(formData.id, formData);
      
      if (response.data.success) {
        setSuccess(true);
        
        // Notify parent component
        if (onSave) {
          onSave(response.data.data);
        }
        
        // Close dialog after a delay
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update measurement');
      }
    } catch (err) {
      console.error('Error updating measurement:', err);
      setError(err.response?.data?.detail || 'Error updating measurement');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Check if there are unsaved changes
    if (JSON.stringify(formData) !== JSON.stringify(measurement)) {
      setConfirmDialogOpen(true);
    } else {
      if (onClose) {
        onClose();
      }
    }
  };

  // Handle confirm dialog close
  const handleConfirmDialogClose = (confirmed) => {
    setConfirmDialogOpen(false);
    
    if (confirmed && onClose) {
      onClose();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (e) {
      return dateString;
    }
  };

  if (!formData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Measurement
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography>Saving changes...</Typography>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Measurement updated successfully!
          </Alert>
        )}
        
        {/* Basic Information */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Basic Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.informacoes_basicas?.nome || ''}
                  onChange={(e) => handleChange('informacoes_basicas', 'nome', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ID"
                  fullWidth
                  value={formData.informacoes_basicas?.id || ''}
                  onChange={(e) => handleChange('informacoes_basicas', 'id', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Exam Date"
                  type="date"
                  fullWidth
                  value={formatDate(formData.informacoes_basicas?.data_exame)}
                  onChange={(e) => handleChange('informacoes_basicas', 'data_exame', e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={formData.informacoes_basicas?.idade || ''}
                  onChange={(e) => handleNumericChange('informacoes_basicas', 'idade', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 120 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  fullWidth
                  value={formData.informacoes_basicas?.sexo || ''}
                  onChange={(e) => handleChange('informacoes_basicas', 'sexo', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Height (cm)"
                  type="number"
                  fullWidth
                  value={formData.informacoes_basicas?.altura || ''}
                  onChange={(e) => handleNumericChange('informacoes_basicas', 'altura', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 300, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Body Composition */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Body Composition</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.peso || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'peso', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 500, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Total Body Water (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.agua_corporal_total || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'agua_corporal_total', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Protein (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.proteina || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'proteina', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Minerals (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.minerais || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'minerais', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Fat Mass (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.massa_gordura || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'massa_gordura', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 200, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Skeletal Muscle Mass (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.massa_muscular_esqueletica || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'massa_muscular_esqueletica', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Fat-Free Mass (kg)"
                  type="number"
                  fullWidth
                  value={formData.composicao_corporal?.massa_livre_gordura || ''}
                  onChange={(e) => handleNumericChange('composicao_corporal', 'massa_livre_gordura', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 200, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Body Indices */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Body Indices</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="BMI"
                  type="number"
                  fullWidth
                  value={formData.indices_corporais?.imc || ''}
                  onChange={(e) => handleNumericChange('indices_corporais', 'imc', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Body Fat Percentage (%)"
                  type="number"
                  fullWidth
                  value={formData.indices_corporais?.pgc || ''}
                  onChange={(e) => handleNumericChange('indices_corporais', 'pgc', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Basal Metabolic Rate (kcal)"
                  type="number"
                  fullWidth
                  value={formData.indices_corporais?.taxa_metabolica_basal || ''}
                  onChange={(e) => handleNumericChange('indices_corporais', 'taxa_metabolica_basal', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 5000, step: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Waist-Hip Ratio"
                  type="number"
                  fullWidth
                  value={formData.indices_corporais?.relacao_cintura_quadril || ''}
                  onChange={(e) => handleNumericChange('indices_corporais', 'relacao_cintura_quadril', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 2, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Visceral Fat Level"
                  type="number"
                  fullWidth
                  value={formData.indices_corporais?.nivel_gordura_visceral || ''}
                  onChange={(e) => handleNumericChange('indices_corporais', 'nivel_gordura_visceral', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 50, step: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Obesity Degree (%)"
                  type="number"
                  fullWidth
                  value={formData.indices_corporais?.grau_obesidade || ''}
                  onChange={(e) => handleNumericChange('indices_corporais', 'grau_obesidade', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 500, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Segmental Analysis */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Segmental Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>
              Lean Mass (kg)
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Left Arm"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_magra?.braco_esquerdo || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_magra) updatedData.analise_segmentar.massa_magra = {};
                    updatedData.analise_segmentar.massa_magra.braco_esquerdo = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 20, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Right Arm"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_magra?.braco_direito || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_magra) updatedData.analise_segmentar.massa_magra = {};
                    updatedData.analise_segmentar.massa_magra.braco_direito = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 20, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Trunk"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_magra?.tronco || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_magra) updatedData.analise_segmentar.massa_magra = {};
                    updatedData.analise_segmentar.massa_magra.tronco = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Left Leg"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_magra?.perna_esquerda || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_magra) updatedData.analise_segmentar.massa_magra = {};
                    updatedData.analise_segmentar.massa_magra.perna_esquerda = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 30, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Right Leg"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_magra?.perna_direita || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_magra) updatedData.analise_segmentar.massa_magra = {};
                    updatedData.analise_segmentar.massa_magra.perna_direita = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 30, step: 0.1 } }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" gutterBottom>
              Fat Mass (kg)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Left Arm"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_gorda?.braco_esquerdo || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_gorda) updatedData.analise_segmentar.massa_gorda = {};
                    updatedData.analise_segmentar.massa_gorda.braco_esquerdo = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 20, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Right Arm"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_gorda?.braco_direito || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_gorda) updatedData.analise_segmentar.massa_gorda = {};
                    updatedData.analise_segmentar.massa_gorda.braco_direito = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 20, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Trunk"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_gorda?.tronco || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_gorda) updatedData.analise_segmentar.massa_gorda = {};
                    updatedData.analise_segmentar.massa_gorda.tronco = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Left Leg"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_gorda?.perna_esquerda || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_gorda) updatedData.analise_segmentar.massa_gorda = {};
                    updatedData.analise_segmentar.massa_gorda.perna_esquerda = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 30, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Right Leg"
                  type="number"
                  fullWidth
                  value={formData.analise_segmentar?.massa_gorda?.perna_direita || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.analise_segmentar) updatedData.analise_segmentar = {};
                    if (!updatedData.analise_segmentar.massa_gorda) updatedData.analise_segmentar.massa_gorda = {};
                    updatedData.analise_segmentar.massa_gorda.perna_direita = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 30, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Other Information */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Other Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="InBody Score"
                  type="number"
                  fullWidth
                  value={formData.pontuacao_inbody || ''}
                  onChange={(e) => handleNumericChange('', 'pontuacao_inbody', e.target.value)}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="InBody Model"
                  fullWidth
                  value={formData.modelo_inbody || ''}
                  onChange={(e) => handleChange('', 'modelo_inbody', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Weight Control
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Ideal Weight (kg)"
                  type="number"
                  fullWidth
                  value={formData.controle_peso?.peso_ideal || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.controle_peso) updatedData.controle_peso = {};
                    updatedData.controle_peso.peso_ideal = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 200, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Weight Control (kg)"
                  type="number"
                  fullWidth
                  value={formData.controle_peso?.controle_peso || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.controle_peso) updatedData.controle_peso = {};
                    updatedData.controle_peso.controle_peso = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: -100, max: 100, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Fat Control (kg)"
                  type="number"
                  fullWidth
                  value={formData.controle_peso?.controle_gordura || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.controle_peso) updatedData.controle_peso = {};
                    updatedData.controle_peso.controle_gordura = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: -100, max: 100, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Muscle Control (kg)"
                  type="number"
                  fullWidth
                  value={formData.controle_peso?.controle_musculo || ''}
                  onChange={(e) => {
                    const updatedData = { ...formData };
                    if (!updatedData.controle_peso) updatedData.controle_peso = {};
                    updatedData.controle_peso.controle_musculo = e.target.value === '' ? '' : Number(e.target.value);
                    setFormData(updatedData);
                  }}
                  margin="normal"
                  InputProps={{ inputProps: { min: -50, max: 50, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
      
      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => handleConfirmDialogClose(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to discard them?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDialogClose(false)}>No, Keep Editing</Button>
          <Button onClick={() => handleConfirmDialogClose(true)} color="error">
            Yes, Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeasurementEditor;
