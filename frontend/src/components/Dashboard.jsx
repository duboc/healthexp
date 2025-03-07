import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import FileUpload from './FileUpload';
import MeasurementTable from './MeasurementTable';
import WeightChart from './charts/WeightChart';
import BodyCompositionChart from './charts/BodyCompositionChart';
import BodyCompositionPieChart from './charts/BodyCompositionPieChart';
import SegmentalAnalysisChart from './charts/SegmentalAnalysisChart';
import apiService from '../services/api';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [previousMeasurement, setPreviousMeasurement] = useState(null);

  // Fetch measurements on component mount
  useEffect(() => {
    fetchMeasurements();
  }, []);

  // Set selected measurement when measurements are loaded
  useEffect(() => {
    if (measurements && measurements.length > 0) {
      // Sort measurements by date (most recent first)
      const sortedMeasurements = [...measurements].sort((a, b) => {
        const dateA = new Date(a.informacoes_basicas?.data_exame);
        const dateB = new Date(b.informacoes_basicas?.data_exame);
        return dateB - dateA;
      });
      
      // Set the most recent measurement as selected
      setSelectedMeasurement(sortedMeasurements[0]);
      
      // Set the second most recent measurement as previous (if available)
      if (sortedMeasurements.length > 1) {
        setPreviousMeasurement(sortedMeasurements[1]);
      }
    }
  }, [measurements]);

  // Fetch all measurements from the API
  const fetchMeasurements = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAllMeasurements();
      
      if (response.data.success) {
        setMeasurements(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch measurements');
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err.response?.data?.detail || 'Error fetching measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle successful upload
  const handleUploadSuccess = (newMeasurement) => {
    // Refresh measurements
    fetchMeasurements();
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Measurement uploaded and processed successfully!',
      severity: 'success',
    });
  };

  // Handle measurement deletion
  const handleDeleteMeasurement = async (id) => {
    try {
      const response = await apiService.deleteMeasurement(id);
      
      if (response.data.success) {
        // Remove the deleted measurement from state
        setMeasurements(measurements.filter(m => m.id !== id));
        
        // Show success message
        setSnackbar({
          open: true,
          message: 'Measurement deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to delete measurement',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Error deleting measurement:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Error deleting measurement',
        severity: 'error',
      });
    }
  };

  // Handle measurement update
  const handleUpdateMeasurement = async (updatedMeasurement) => {
    try {
      const response = await apiService.updateMeasurement(updatedMeasurement.id, updatedMeasurement);
      
      if (response.data.success) {
        // Update the measurement in state
        setMeasurements(measurements.map(m => 
          m.id === updatedMeasurement.id ? updatedMeasurement : m
        ));
        
        // Show success message
        setSnackbar({
          open: true,
          message: 'Measurement updated successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to update measurement',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Error updating measurement:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Error updating measurement',
        severity: 'error',
      });
    }
  };

  // Handle measurement selection change
  const handleMeasurementChange = (event) => {
    const selectedId = event.target.value;
    const measurement = measurements.find(m => m.id === selectedId);
    
    if (measurement) {
      // Find the previous measurement (the one before the selected one in chronological order)
      const sortedMeasurements = [...measurements].sort((a, b) => {
        const dateA = new Date(a.informacoes_basicas?.data_exame);
        const dateB = new Date(b.informacoes_basicas?.data_exame);
        return dateB - dateA; // Descending order (most recent first)
      });
      
      const selectedIndex = sortedMeasurements.findIndex(m => m.id === selectedId);
      
      // Set the selected measurement
      setSelectedMeasurement(measurement);
      
      // Set the previous measurement if available
      if (selectedIndex < sortedMeasurements.length - 1) {
        setPreviousMeasurement(sortedMeasurements[selectedIndex + 1]);
      } else {
        setPreviousMeasurement(null);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Render measurement summary cards
  const renderMeasurementSummary = () => {
    if (!selectedMeasurement) return null;
    
    const { informacoes_basicas, composicao_corporal, indices_corporais } = selectedMeasurement;
    
    // Calculate changes if previous measurement exists
    const calculateChange = (current, previous) => {
      if (current === undefined || current === null || previous === undefined || previous === null) {
        return null;
      }
      return current - previous;
    };
    
    // Get previous values
    const prevWeight = previousMeasurement?.composicao_corporal?.peso;
    const prevFat = previousMeasurement?.composicao_corporal?.massa_gordura;
    const prevMuscle = previousMeasurement?.composicao_corporal?.massa_muscular_esqueletica;
    const prevBMI = previousMeasurement?.indices_corporais?.imc;
    const prevPBF = previousMeasurement?.indices_corporais?.pgc;
    
    // Calculate changes
    const weightChange = calculateChange(composicao_corporal?.peso, prevWeight);
    const fatChange = calculateChange(composicao_corporal?.massa_gordura, prevFat);
    const muscleChange = calculateChange(composicao_corporal?.massa_muscular_esqueletica, prevMuscle);
    const bmiChange = calculateChange(indices_corporais?.imc, prevBMI);
    const pbfChange = calculateChange(indices_corporais?.pgc, prevPBF);
    
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Weight Card */}
        <Grid item xs={6} sm={4} md={2}>
          <Card elevation={3}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Weight
              </Typography>
              <Typography variant="h5" component="div">
                {composicao_corporal?.peso?.toFixed(1) || 'N/A'} kg
              </Typography>
              {weightChange !== null && (
                <Typography 
                  variant="body2" 
                  color={weightChange < 0 ? 'success.main' : weightChange > 0 ? 'error.main' : 'text.secondary'}
                >
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* BMI Card */}
        <Grid item xs={6} sm={4} md={2}>
          <Card elevation={3}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                BMI
              </Typography>
              <Typography variant="h5" component="div">
                {indices_corporais?.imc?.toFixed(1) || 'N/A'}
              </Typography>
              {bmiChange !== null && (
                <Typography 
                  variant="body2" 
                  color={bmiChange < 0 ? 'success.main' : bmiChange > 0 ? 'error.main' : 'text.secondary'}
                >
                  {bmiChange > 0 ? '+' : ''}{bmiChange.toFixed(1)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Body Fat % Card */}
        <Grid item xs={6} sm={4} md={2}>
          <Card elevation={3}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Body Fat %
              </Typography>
              <Typography variant="h5" component="div">
                {indices_corporais?.pgc?.toFixed(1) || 'N/A'}%
              </Typography>
              {pbfChange !== null && (
                <Typography 
                  variant="body2" 
                  color={pbfChange < 0 ? 'success.main' : pbfChange > 0 ? 'error.main' : 'text.secondary'}
                >
                  {pbfChange > 0 ? '+' : ''}{pbfChange.toFixed(1)}%
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Muscle Mass Card */}
        <Grid item xs={6} sm={4} md={2}>
          <Card elevation={3}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Muscle Mass
              </Typography>
              <Typography variant="h5" component="div">
                {composicao_corporal?.massa_muscular_esqueletica?.toFixed(1) || 'N/A'} kg
              </Typography>
              {muscleChange !== null && (
                <Typography 
                  variant="body2" 
                  color={muscleChange > 0 ? 'success.main' : muscleChange < 0 ? 'error.main' : 'text.secondary'}
                >
                  {muscleChange > 0 ? '+' : ''}{muscleChange.toFixed(1)} kg
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Fat Mass Card */}
        <Grid item xs={6} sm={4} md={2}>
          <Card elevation={3}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Fat Mass
              </Typography>
              <Typography variant="h5" component="div">
                {composicao_corporal?.massa_gordura?.toFixed(1) || 'N/A'} kg
              </Typography>
              {fatChange !== null && (
                <Typography 
                  variant="body2" 
                  color={fatChange < 0 ? 'success.main' : fatChange > 0 ? 'error.main' : 'text.secondary'}
                >
                  {fatChange > 0 ? '+' : ''}{fatChange.toFixed(1)} kg
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* InBody Score Card */}
        <Grid item xs={6} sm={4} md={2}>
          <Card elevation={3}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                InBody Score
              </Typography>
              <Typography variant="h5" component="div">
                {selectedMeasurement?.pontuacao_inbody || 'N/A'}
              </Typography>
              {previousMeasurement?.pontuacao_inbody && (
                <Typography 
                  variant="body2" 
                  color={(selectedMeasurement?.pontuacao_inbody - previousMeasurement?.pontuacao_inbody) > 0 ? 'success.main' : 'error.main'}
                >
                  {(selectedMeasurement?.pontuacao_inbody - previousMeasurement?.pontuacao_inbody) > 0 ? '+' : ''}
                  {selectedMeasurement?.pontuacao_inbody - previousMeasurement?.pontuacao_inbody}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        InBody Measurement Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Dashboard" />
            <Tab label="Measurement History" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            {loading && measurements.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                {error}
              </Alert>
            ) : measurements.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No measurements found. Upload an InBody measurement to get started.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Measurement Selector */}
                <Box sx={{ p: 3, pb: 0 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="dashboard-measurement-select-label">Select Measurement</InputLabel>
                    <Select
                      labelId="dashboard-measurement-select-label"
                      id="dashboard-measurement-select"
                      value={selectedMeasurement?.id || ''}
                      label="Select Measurement"
                      onChange={handleMeasurementChange}
                    >
                      {measurements.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {formatDate(m.informacoes_basicas?.data_exame)} - {m.informacoes_basicas?.nome || 'Unknown'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {/* Measurement Summary Cards */}
                  {renderMeasurementSummary()}
                </Box>
                
                <Grid container spacing={3} sx={{ p: 3, pt: 0 }}>
                  <Grid item xs={12}>
                    <WeightChart 
                      measurements={measurements} 
                      selectedMeasurement={selectedMeasurement}
                      loading={loading} 
                      error={error} 
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <BodyCompositionChart 
                      measurements={measurements} 
                      selectedMeasurement={selectedMeasurement}
                      loading={loading} 
                      error={error} 
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <BodyCompositionPieChart 
                      measurements={measurements} 
                      selectedMeasurement={selectedMeasurement}
                      loading={loading} 
                      error={error} 
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <SegmentalAnalysisChart 
                      measurements={measurements} 
                      selectedMeasurement={selectedMeasurement}
                      loading={loading} 
                      error={error} 
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <MeasurementTable
              measurements={measurements}
              loading={loading}
              error={error}
              onMeasurementDelete={handleDeleteMeasurement}
              onMeasurementUpdate={handleUpdateMeasurement}
            />
          </TabPanel>
        </Paper>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
