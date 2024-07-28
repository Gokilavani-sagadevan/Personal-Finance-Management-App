import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, useTheme, useMediaQuery, SelectChangeEvent } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Budget } from '../services/api';

interface BudgetListProps {
  budgets: Budget[];
  onUpdateBudget: (id: number, updatedBudget: Partial<Budget>) => void;
  onDeleteBudget: (id: number) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onUpdateBudget, onDeleteBudget }) => {
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditClick = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleEditClose = () => {
    setEditingBudget(null);
  };

  const handleEditSave = () => {
    if (editingBudget) {
      onUpdateBudget(editingBudget.id!, editingBudget);
      handleEditClose();
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    if (editingBudget) {
      const { name, value } = e.target;
      setEditingBudget({
        ...editingBudget,
        [name]: name === 'amount' ? parseFloat(value) : value,
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.category}</TableCell>
                <TableCell align="right">${budget.amount.toFixed(2)}</TableCell>
                <TableCell>{budget.period}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(budget)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDeleteBudget(budget.id!)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingBudget} onClose={handleEditClose}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          {editingBudget && (
            <>
              <TextField
                margin="dense"
                name="category"
                label="Category"
                fullWidth
                value={editingBudget.category}
                onChange={handleEditChange}
                variant="outlined"
              />
              <TextField
                margin="dense"
                name="amount"
                label="Amount"
                type="number"
                fullWidth
                value={editingBudget.amount}
                onChange={handleEditChange}
                variant="outlined"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Period</InputLabel>
                <Select
                  name="period"
                  value={editingBudget.period}
                  onChange={handleEditChange}
                  label="Period"
                >
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                  <MenuItem value="YEARLY">Yearly</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetList;