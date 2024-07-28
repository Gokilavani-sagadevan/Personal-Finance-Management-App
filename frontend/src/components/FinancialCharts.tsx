import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Grid, Paper, Typography, useTheme } from '@mui/material';
import { Transaction, Budget } from '../services/api';

interface FinancialChartsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions, budgets }) => {
  const theme = useTheme();

  // Prepare data for Expense by Category chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Prepare data for Income vs Expenses chart
  const incomeVsExpenses = [
    {
      name: 'Income',
      amount: transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0),
    },
    {
      name: 'Expenses',
      amount: transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0),
    },
  ];

  // Prepare data for Budget vs Actual Spending chart
  const budgetVsActual = budgets.map(budget => {
    const actualSpending = transactions
      .filter(t => t.type === 'EXPENSE' && t.category === budget.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      category: budget.category,
      budget: Number(budget.amount),
      actual: actualSpending || 0.01, // Use a small non-zero value if actual is 0
    };
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2, height: 300 }}>
          <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={pieChartData} fill={theme.palette.primary.main} label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2, height: 300 }}>
          <Typography variant="h6" gutterBottom>Income vs Expenses</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, height: 300 }}>
          <Typography variant="h6" gutterBottom>Budget vs Actual Spending</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill={theme.palette.primary.main} name="Budget" />
              <Bar dataKey="actual" fill={theme.palette.secondary.main} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinancialCharts;