import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = ({ measurements, selectedMeasurement, loading, error }) => {
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

    // Extract dates and weights
    const labels = sortedMeasurements.map(m => {
      const date = new Date(m.informacoes_basicas?.data_exame);
      return date.toLocaleDateString();
    });

    const weightData = sortedMeasurements.map(m => m.composicao_corporal?.peso || null);
    const muscleData = sortedMeasurements.map(m => m.composicao_corporal?.massa_muscular_esqueletica || null);
    const fatData = sortedMeasurements.map(m => m.composicao_corporal?.massa_gordura || null);

    // Create chart data
    const data = {
      labels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weightData,
          borderColor: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}50`,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: (ctx) => {
            // Highlight the selected measurement point
            if (!selectedMeasurement) return 3;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? 6 : 3;
          },
          pointBackgroundColor: (ctx) => {
            if (!selectedMeasurement) return theme.palette.primary.main;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? theme.palette.primary.dark : theme.palette.primary.main;
          },
          pointBorderColor: (ctx) => {
            if (!selectedMeasurement) return theme.palette.primary.main;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? theme.palette.common.white : theme.palette.primary.main;
          },
          pointBorderWidth: (ctx) => {
            if (!selectedMeasurement) return 1;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? 2 : 1;
          },
        },
        {
          label: 'Muscle Mass (kg)',
          data: muscleData,
          borderColor: theme.palette.success.main,
          backgroundColor: `${theme.palette.success.main}50`,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: (ctx) => {
            if (!selectedMeasurement) return 3;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? 6 : 3;
          },
          pointBackgroundColor: (ctx) => {
            if (!selectedMeasurement) return theme.palette.success.main;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? theme.palette.success.dark : theme.palette.success.main;
          },
          pointBorderColor: (ctx) => {
            if (!selectedMeasurement) return theme.palette.success.main;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? theme.palette.common.white : theme.palette.success.main;
          },
          pointBorderWidth: (ctx) => {
            if (!selectedMeasurement) return 1;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? 2 : 1;
          },
        },
        {
          label: 'Fat Mass (kg)',
          data: fatData,
          borderColor: theme.palette.error.main,
          backgroundColor: `${theme.palette.error.main}50`,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: (ctx) => {
            if (!selectedMeasurement) return 3;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? 6 : 3;
          },
          pointBackgroundColor: (ctx) => {
            if (!selectedMeasurement) return theme.palette.error.main;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? theme.palette.error.dark : theme.palette.error.main;
          },
          pointBorderColor: (ctx) => {
            if (!selectedMeasurement) return theme.palette.error.main;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? theme.palette.common.white : theme.palette.error.main;
          },
          pointBorderWidth: (ctx) => {
            if (!selectedMeasurement) return 1;
            
            const index = sortedMeasurements.findIndex(m => m.id === selectedMeasurement.id);
            return ctx.dataIndex === index ? 2 : 1;
          },
        },
      ],
    };

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
        text: 'Weight Progression',
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
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 2,
      }
    },
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Weight Progression
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
              No data available. Upload InBody measurements to see your progress.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 300 }}>
            {chartData && <Line data={chartData} options={options} />}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WeightChart;
