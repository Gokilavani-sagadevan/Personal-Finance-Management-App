import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Transaction } from '../services/api';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

// Define a separate interface for the form state
interface TransactionFormState {
  amount: string;
  category: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [transaction, setTransaction] = useState<TransactionFormState>({
    amount: '',
    category: '',
    date: '',
    type: 'EXPENSE'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transaction.amount && transaction.category && transaction.date) {
      onAddTransaction({
        ...transaction,
        amount: parseFloat(transaction.amount)
      });
      setTransaction({ amount: '', category: '', date: '', type: 'EXPENSE' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={transaction.amount}
            onChange={handleChange}
            required
            inputProps={{ step: "0.01" }}
            placeholder="Enter amount"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={transaction.category}
            onChange={handleChange}
            required
            placeholder="Enter category"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={transaction.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={transaction.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="INCOME">Income</MenuItem>
              <MenuItem value="EXPENSE">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Transaction
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TransactionForm;