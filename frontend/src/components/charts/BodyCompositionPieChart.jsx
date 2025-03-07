import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, useTheme } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const BodyCompositionPieChart = ({ measurements, selectedMeasurement, loading, error }) => {
  const [chartData, setChartData] = useState(null);
  const [displayMode, setDisplayMode] = useState('percentage'); // 'percentage' or 'absolute'
  const theme = useTheme();

  useEffect(() => {
    if (selectedMeasurement) {
      prepareChartData(selectedMeasurement);
    }
  }, [selectedMeasurement, displayMode]);

  // Handle display mode change
  const handleDisplayModeChange = (event) => {
    setDisplayMode(event.target.value);
  };

  // Prepare chart data from the selected measurement
  const prepareChartData = (measurement) => {
    const composicao = measurement.composicao_corporal;
    
    if (!composicao) {
      setChartData(null);
      return;
    }

    // Extract body composition data
    const fatMass = composicao.massa_gordura || 0;
    const proteinMass = composicao.proteina || 0;
    const mineralMass = composicao.minerais || 0;
    const waterMass = composicao.agua_corporal_total || 0;
    
    // Calculate total weight
    const totalWeight = composicao.peso || (fatMass + proteinMass + mineralMass + waterMass);
    
    // Prepare data based on display mode
    let data;
    
    if (displayMode === 'percentage') {
      // Calculate percentages
      const fatPercentage = (fatMass / totalWeight) * 100;
      const proteinPercentage = (proteinMass / totalWeight) * 100;
      const mineralPercentage = (mineralMass / totalWeight) * 100;
      const waterPercentage = (waterMass / totalWeight) * 100;
      
      data = {
        labels: ['Fat', 'Protein', 'Minerals', 'Water'],
        datasets: [
          {
            data: [
              fatPercentage.toFixed(1),
              proteinPercentage.toFixed(1),
              mineralPercentage.toFixed(1),
              waterPercentage.toFixed(1),
            ],
            backgroundColor: [
              theme.palette.error.light,
              theme.palette.warning.light,
              theme.palette.secondary.light,
              theme.palette.primary.light,
            ],
            borderColor: [
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.secondary.main,
              theme.palette.primary.main,
            ],
            borderWidth: 2,
            hoverBackgroundColor: [
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.secondary.main,
              theme.palette.primary.main,
            ],
            hoverBorderColor: theme.palette.background.paper,
            hoverBorderWidth: 2,
          },
        ],
      };
    } else {
      // Use absolute values
      data = {
        labels: ['Fat', 'Protein', 'Minerals', 'Water'],
        datasets: [
          {
            data: [
              fatMass.toFixed(1),
              proteinMass.toFixed(1),
              mineralMass.toFixed(1),
              waterMass.toFixed(1),
            ],
            backgroundColor: [
              theme.palette.error.light,
              theme.palette.warning.light,
              theme.palette.secondary.light,
              theme.palette.primary.light,
            ],
            borderColor: [
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.secondary.main,
              theme.palette.primary.main,
            ],
            borderWidth: 2,
            hoverBackgroundColor: [
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.secondary.main,
              theme.palette.primary.main,
            ],
            hoverBorderColor: theme.palette.background.paper,
            hoverBorderWidth: 2,
          },
        ],
      };
    }

    setChartData(data);
  };


  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: 'Body Composition',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} ${displayMode === 'percentage' ? '%' : 'kg'}`;
          }
        }
      }
    },
    cutout: '60%',
    radius: '90%',
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Body Composition Breakdown
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : !measurements || measurements.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No data available. Upload InBody measurements to see your body composition.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', mb: 3, justifyContent: 'flex-end' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="display-mode-label">Display Mode</InputLabel>
                <Select
                  labelId="display-mode-label"
                  id="display-mode-select"
                  value={displayMode}
                  label="Display Mode"
                  onChange={handleDisplayModeChange}
                  size="small"
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="absolute">Weight (kg)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {selectedMeasurement && !selectedMeasurement.composicao_corporal ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No body composition data available for this measurement.
              </Alert>
            ) : (
              <Box sx={{ height: 300, position: 'relative' }}>
                {chartData && <Pie data={chartData} options={options} />}
                {selectedMeasurement && selectedMeasurement.composicao_corporal && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      zIndex: -1
                    }}
                  >
                    <Typography variant="h4" color="text.secondary" sx={{ opacity: 0.7 }}>
                      {selectedMeasurement.composicao_corporal.peso?.toFixed(1) || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                      kg
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default BodyCompositionPieChart;
