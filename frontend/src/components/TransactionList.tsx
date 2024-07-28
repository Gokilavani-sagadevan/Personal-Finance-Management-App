import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, useTheme, useMediaQuery } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Transaction } from '../services/api';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: number, updatedTransaction: Partial<Transaction>) => void;
  onDeleteTransaction: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onUpdateTransaction, onDeleteTransaction }) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditClose = () => {
    setEditingTransaction(null);
  };

  const handleEditSave = () => {
    if (editingTransaction) {
      onUpdateTransaction(editingTransaction.id!, editingTransaction);
      handleEditClose();
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTransaction) {
      setEditingTransaction({
        ...editingTransaction,
        [e.target.name]: e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value,
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right">${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(transaction)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDeleteTransaction(transaction.id!)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingTransaction} onClose={handleEditClose}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {editingTransaction && (
            <>
              <TextField
                margin="dense"
                name="amount"
                label="Amount"
                type="number"
                fullWidth
                value={editingTransaction.amount}
                onChange={handleEditChange}
                variant="outlined"
              />
              <TextField
                margin="dense"
                name="category"
                label="Category"
                fullWidth
                value={editingTransaction.category}
                onChange={handleEditChange}
                variant="outlined"
              />
              <TextField
                margin="dense"
                name="date"
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editingTransaction.date}
                onChange={handleEditChange}
                variant="outlined"
              />
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

export default TransactionList;