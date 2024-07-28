import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Budget } from '../services/api';

interface BudgetFormProps {
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onAddBudget }) => {
  const [budget, setBudget] = useState<Omit<Budget, 'id'>>({
    category: '',
    amount: 0,
    period: 'MONTHLY'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBudget(budget);
    setBudget({ category: '', amount: 0, period: 'MONTHLY' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={budget.category}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={budget.amount}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Period</InputLabel>
            <Select
              name="period"
              value={budget.period}
              onChange={handleChange}
              label="Period"
              required
            >
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="YEARLY">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Budget
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default BudgetForm;