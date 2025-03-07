import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, useTheme } from '@mui/material';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BodyCompositionChart = ({ measurements, selectedMeasurement, loading, error }) => {
  const [chartData, setChartData] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (measurements && measurements.length > 0) {
      prepareChartData();
    }
  }, [measurements, selectedMeasurement]);

  // Prepare chart data from measurements
  const prepareChartData = () => {
    // Sort measurements by date
    const sortedMeasurements = [...measurements].sort((a, b) => {
      const dateA = new Date(a.informacoes_basicas?.data_exame);
      const dateB = new Date(b.informacoes_basicas?.data_exame);
      return dateA - dateB;
    });

    // Extract dates for labels
    const labels = sortedMeasurements.map(m => {
      const date = new Date(m.informacoes_basicas?.data_exame);
      return date.toLocaleDateString();
    });

    // Extract body composition data
    const muscleData = sortedMeasurements.map(m => m.composicao_corporal?.massa_muscular_esqueletica || 0);
    const fatData = sortedMeasurements.map(m => m.composicao_corporal?.massa_gordura || 0);
    const waterData = sortedMeasurements.map(m => m.composicao_corporal?.agua_corporal_total || 0);
    const proteinData = sortedMeasurements.map(m => m.composicao_corporal?.proteina || 0);
    const mineralsData = sortedMeasurements.map(m => m.composicao_corporal?.minerais || 0);

    // Create chart data
    const data = {
      labels,
      datasets: [
        {
          label: 'Muscle Mass',
          data: muscleData,
          backgroundColor: theme.palette.success.light,
          borderColor: theme.palette.success.main,
          borderWidth: 1,
          stack: 'Stack 0',
          hoverBackgroundColor: theme.palette.success.main,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          label: 'Fat Mass',
          data: fatData,
          backgroundColor: theme.palette.error.light,
          borderColor: theme.palette.error.main,
          borderWidth: 1,
          stack: 'Stack 0',
          hoverBackgroundColor: theme.palette.error.main,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          label: 'Water',
          data: waterData,
          backgroundColor: theme.palette.primary.light,
          borderColor: theme.palette.primary.main,
          borderWidth: 1,
          stack: 'Stack 1',
          hoverBackgroundColor: theme.palette.primary.main,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          label: 'Protein',
          data: proteinData,
          backgroundColor: theme.palette.warning.light,
          borderColor: theme.palette.warning.main,
          borderWidth: 1,
          stack: 'Stack 1',
          hoverBackgroundColor: theme.palette.warning.main,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          label: 'Minerals',
          data: mineralsData,
          backgroundColor: theme.palette.secondary.light,
          borderColor: theme.palette.secondary.main,
          borderWidth: 1,
          stack: 'Stack 1',
          hoverBackgroundColor: theme.palette.secondary.main,
          barThickness: 'flex',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    };

    // Highlight the selected measurement if available
    if (selectedMeasurement) {
      const selectedIndex = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
      
      if (selectedIndex !== -1) {
        // Add a custom property to highlight the selected bar
        data.selectedIndex = selectedIndex;
      }
    }

    setChartData(data);
  };

  // Chart options
  const options = {
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
        text: 'Body Composition',
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
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} kg`;
          },
          afterBody: function(context) {
            // Add total weight for this date
            const dataIndex = context[0].dataIndex;
            const sortedMeasurements = [...measurements].sort((a, b) => {
              const dateA = new Date(a.informacoes_basicas?.data_exame);
              const dateB = new Date(b.informacoes_basicas?.data_exame);
              return dateA - dateB;
            });
            
            if (dataIndex < sortedMeasurements.length) {
              const measurement = sortedMeasurements[dataIndex];
              return [`Total Weight: ${measurement.composicao_corporal?.peso?.toFixed(1) || 'N/A'} kg`];
            }
            return [];
          }
        }
      }
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
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
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        },
        title: {
          display: true,
          text: 'Date',
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: 'bold'
          }
        },
      },
    },
    animation: {
      duration: 1000,
    },
    // Custom animation to highlight the selected measurement
    animation: {
      onProgress: function(animation) {
        const chart = animation.chart;
        
        if (chartData && chartData.selectedIndex !== undefined) {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0); // Use first dataset meta for positioning
          
          if (meta.data && meta.data[chartData.selectedIndex]) {
            const x = meta.data[chartData.selectedIndex].x;
            
            // Draw a vertical line at the selected measurement
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, chart.chartArea.top);
            ctx.lineTo(x, chart.chartArea.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = theme.palette.primary.main;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Body Composition
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
          <Box sx={{ height: 300 }}>
            {chartData && <Bar data={chartData} options={options} />}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BodyCompositionChart;
