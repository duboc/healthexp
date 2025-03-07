import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import apiService from '../services/api';
import MeasurementEditor from './MeasurementEditor';

const MeasurementTable = ({ measurements, onMeasurementSelect, onMeasurementDelete, onMeasurementUpdate, loading, error }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [measurementToEdit, setMeasurementToEdit] = useState(null);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };

  // Handle view measurement
  const handleViewMeasurement = (measurement) => {
    if (onMeasurementSelect) {
      onMeasurementSelect(measurement);
    }
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = (measurement) => {
    setMeasurementToDelete(measurement);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (measurementToDelete && onMeasurementDelete) {
      onMeasurementDelete(measurementToDelete.id);
    }
    setDeleteDialogOpen(false);
    setMeasurementToDelete(null);
  };

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setMeasurementToDelete(null);
  };

  // Handle edit button click
  const handleEditClick = (measurement) => {
    setMeasurementToEdit(measurement);
    setEditDialogOpen(true);
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setMeasurementToEdit(null);
  };

  // Handle measurement update
  const handleMeasurementUpdate = (updatedMeasurement) => {
    if (onMeasurementUpdate) {
      onMeasurementUpdate(updatedMeasurement);
    }
    setEditDialogOpen(false);
    setMeasurementToEdit(null);
  };

  // Empty rows
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - (measurements?.length || 0))
    : 0;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Measurement History
      </Typography>
      
      <Paper elevation={3}>
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
              No measurements found. Upload an InBody measurement to get started.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table aria-label="measurement history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Weight (kg)</TableCell>
                    <TableCell>BMI</TableCell>
                    <TableCell>Body Fat (%)</TableCell>
                    <TableCell>Muscle Mass (kg)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {measurements
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((measurement) => (
                      <TableRow
                        key={measurement.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          {formatDate(measurement.informacoes_basicas?.data_exame)}
                        </TableCell>
                        <TableCell>{measurement.informacoes_basicas?.nome || 'N/A'}</TableCell>
                        <TableCell>{measurement.composicao_corporal?.peso?.toFixed(1) || 'N/A'}</TableCell>
                        <TableCell>{measurement.indices_corporais?.imc?.toFixed(1) || 'N/A'}</TableCell>
                        <TableCell>{measurement.indices_corporais?.pgc?.toFixed(1) || 'N/A'}</TableCell>
                        <TableCell>
                          {measurement.composicao_corporal?.massa_muscular_esqueletica?.toFixed(1) || 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewMeasurement(measurement)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              color="secondary"
                              onClick={() => handleEditClick(measurement)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(measurement)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={measurements.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this measurement? This action cannot be undone.
          </Typography>
          {measurementToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(measurementToDelete.informacoes_basicas?.data_exame)}
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {measurementToDelete.informacoes_basicas?.nome || 'N/A'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Measurement Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {measurementToEdit && (
            <MeasurementEditor
              measurement={measurementToEdit}
              onClose={handleEditDialogClose}
              onSave={handleMeasurementUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MeasurementTable;
