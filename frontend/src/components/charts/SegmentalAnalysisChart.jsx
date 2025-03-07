import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert, 
  useTheme, 
  Grid,
  LinearProgress,
  Tooltip as MuiTooltip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SegmentalAnalysisChart = ({ measurements, selectedMeasurement, loading, error }) => {
  const [chartData, setChartData] = useState(null);
  const [segmentData, setSegmentData] = useState(null);
  const [symmetryScores, setSymmetryScores] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (selectedMeasurement) {
      const data = prepareData(selectedMeasurement);
      setSegmentData(data);
      prepareChartData(data);
      calculateSymmetryScores(data);
    }
  }, [selectedMeasurement]);

  // Prepare segment data from the measurement
  const prepareData = (measurement) => {
    if (!measurement.analise_segmentar) {
      return null;
    }

    const { massa_magra, massa_gorda } = measurement.analise_segmentar;
    
    // Check if segmental data exists
    if (!massa_magra && !massa_gorda) {
      return null;
    }

    // Calculate totals and percentages
    const calculateSegmentData = (muscle, fat) => {
      const total = muscle + fat;
      const musclePercentage = total > 0 ? (muscle / total) * 100 : 0;
      const fatPercentage = total > 0 ? (fat / total) * 100 : 0;
      
      return {
        muscle,
        fat,
        total,
        musclePercentage,
        fatPercentage
      };
    };
    
    // Extract and organize segmental data
    return {
      leftArm: calculateSegmentData(massa_magra?.braco_esquerdo || 0, massa_gorda?.braco_esquerdo || 0),
      rightArm: calculateSegmentData(massa_magra?.braco_direito || 0, massa_gorda?.braco_direito || 0),
      trunk: calculateSegmentData(massa_magra?.tronco || 0, massa_gorda?.tronco || 0),
      leftLeg: calculateSegmentData(massa_magra?.perna_esquerda || 0, massa_gorda?.perna_esquerda || 0),
      rightLeg: calculateSegmentData(massa_magra?.perna_direita || 0, massa_gorda?.perna_direita || 0)
    };
  };

  // Calculate symmetry scores
  const calculateSymmetryScores = (data) => {
    if (!data) {
      setSymmetryScores(null);
      return;
    }

    // Calculate symmetry percentage (100% means perfect symmetry)
    const calculateSymmetry = (left, right) => {
      if (left === 0 && right === 0) return 100;
      const max = Math.max(left, right);
      const min = Math.min(left, right);
      return (min / max) * 100;
    };

    const armMuscleSymmetry = calculateSymmetry(data.leftArm.muscle, data.rightArm.muscle);
    const armFatSymmetry = calculateSymmetry(data.leftArm.fat, data.rightArm.fat);
    const legMuscleSymmetry = calculateSymmetry(data.leftLeg.muscle, data.rightLeg.muscle);
    const legFatSymmetry = calculateSymmetry(data.leftLeg.fat, data.rightLeg.fat);

    // Overall symmetry score (average of all symmetry scores)
    const overallSymmetry = (armMuscleSymmetry + armFatSymmetry + legMuscleSymmetry + legFatSymmetry) / 4;

    setSymmetryScores({
      arms: {
        muscle: armMuscleSymmetry,
        fat: armFatSymmetry,
        overall: (armMuscleSymmetry + armFatSymmetry) / 2
      },
      legs: {
        muscle: legMuscleSymmetry,
        fat: legFatSymmetry,
        overall: (legMuscleSymmetry + legFatSymmetry) / 2
      },
      overall: overallSymmetry
    });
  };

  // Prepare chart data for horizontal stacked bar chart
  const prepareChartData = (data) => {
    if (!data) {
      setChartData(null);
      return;
    }

    const chartData = {
      labels: ['Left Arm', 'Right Arm', 'Trunk', 'Left Leg', 'Right Leg'],
      datasets: [
        {
          label: 'Muscle Mass (kg)',
          data: [
            data.leftArm.muscle,
            data.rightArm.muscle,
            data.trunk.muscle,
            data.leftLeg.muscle,
            data.rightLeg.muscle
          ],
          backgroundColor: theme.palette.success.main,
          borderColor: theme.palette.success.dark,
          borderWidth: 1,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          label: 'Fat Mass (kg)',
          data: [
            data.leftArm.fat,
            data.rightArm.fat,
            data.trunk.fat,
            data.leftLeg.fat,
            data.rightLeg.fat
          ],
          backgroundColor: theme.palette.error.main,
          borderColor: theme.palette.error.dark,
          borderWidth: 1,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        }
      ]
    };

    setChartData(chartData);
  };

  // Chart options for horizontal stacked bar chart
  const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Body Composition by Segment',
        font: {
          size: 16,
          weight: 'bold'
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
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)} kg`;
          },
          afterBody: function(context) {
            if (!segmentData) return [];
            
            const segmentIndex = context[0].dataIndex;
            const segmentKeys = ['leftArm', 'rightArm', 'trunk', 'leftLeg', 'rightLeg'];
            const segment = segmentData[segmentKeys[segmentIndex]];
            
            if (segment) {
              return [
                `Muscle: ${segment.musclePercentage.toFixed(1)}%`,
                `Fat: ${segment.fatPercentage.toFixed(1)}%`,
                `Total: ${segment.total.toFixed(1)} kg`
              ];
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Weight (kg)',
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: 'bold'
          }
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    animation: {
      duration: 1000,
    }
  };

  // Render muscle-to-fat ratio progress bars
  const renderMuscleToFatRatios = () => {
    if (!segmentData) return null;

    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Muscle-to-Fat Ratio by Segment
          </Typography>
        </Grid>
        
        {Object.entries(segmentData).map(([key, segment]) => {
          const label = {
            leftArm: 'Left Arm',
            rightArm: 'Right Arm',
            trunk: 'Trunk',
            leftLeg: 'Left Leg',
            rightLeg: 'Right Leg'
          }[key];
          
          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{label}</span>
                  <span>{segment.musclePercentage.toFixed(0)}% muscle / {segment.fatPercentage.toFixed(0)}% fat</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: `${segment.musclePercentage}%`, 
                      bgcolor: theme.palette.success.main 
                    }} 
                  />
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: `${segment.fatPercentage}%`, 
                      bgcolor: theme.palette.error.main 
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Render symmetry scores
  const renderSymmetryScores = () => {
    if (!symmetryScores) return null;

    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CompareArrowsIcon sx={{ mr: 1 }} /> Body Symmetry Analysis
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <MuiTooltip title="Overall symmetry between left and right sides of the body">
            <Card elevation={2}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Overall Symmetry
                </Typography>
                <Typography variant="h5" component="div" color={getSymmetryColor(symmetryScores.overall)}>
                  {symmetryScores.overall.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </MuiTooltip>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <MuiTooltip title="Symmetry between left and right arms">
            <Card elevation={2}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Arm Symmetry
                </Typography>
                <Typography variant="h5" component="div" color={getSymmetryColor(symmetryScores.arms.overall)}>
                  {symmetryScores.arms.overall.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Muscle: {symmetryScores.arms.muscle.toFixed(1)}% | Fat: {symmetryScores.arms.fat.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </MuiTooltip>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <MuiTooltip title="Symmetry between left and right legs">
            <Card elevation={2}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Leg Symmetry
                </Typography>
                <Typography variant="h5" component="div" color={getSymmetryColor(symmetryScores.legs.overall)}>
                  {symmetryScores.legs.overall.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Muscle: {symmetryScores.legs.muscle.toFixed(1)}% | Fat: {symmetryScores.legs.fat.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </MuiTooltip>
        </Grid>
      </Grid>
    );
  };

  // Helper function to get color based on symmetry score
  const getSymmetryColor = (score) => {
    if (score >= 95) return theme.palette.success.main;
    if (score >= 85) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Segmental Analysis
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
              No data available. Upload InBody measurements to see your segmental analysis.
            </Typography>
          </Box>
        ) : (
          <>
            {selectedMeasurement && !selectedMeasurement.analise_segmentar ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No segmental analysis data available for this measurement.
              </Alert>
            ) : (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedMeasurement?.informacoes_basicas?.data_exame && 
                    new Date(selectedMeasurement.informacoes_basicas.data_exame).toLocaleDateString()}
                </Typography>
                
                {/* Horizontal stacked bar chart */}
                <Box sx={{ height: 250 }}>
                  {chartData && <Bar data={chartData} options={options} />}
                </Box>
                
                {/* Muscle-to-fat ratio indicators */}
                {renderMuscleToFatRatios()}
                
                {/* Symmetry scores */}
                {renderSymmetryScores()}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SegmentalAnalysisChart;
