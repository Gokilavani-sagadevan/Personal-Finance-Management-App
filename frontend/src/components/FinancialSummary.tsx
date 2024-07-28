import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward, TrendingUp } from '@mui/icons-material';
import { green, red, blue } from '@mui/material/colors';
import { Transaction } from '../services/api';

const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
}));

interface FinancialSummaryProps {
  transactions: Transaction[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <SummaryCard elevation={3} sx={{ backgroundColor: green[50] }}>
          <ArrowUpward fontSize="large" sx={{ color: green[500] }} />
          <Typography variant="h6" color={green[700]}>Total Income</Typography>
          <Typography variant="h4" sx={{ color: green[800] }}>${totalIncome.toFixed(2)}</Typography>
        </SummaryCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <SummaryCard elevation={3} sx={{ backgroundColor: red[50] }}>
          <ArrowDownward fontSize="large" sx={{ color: red[500] }} />
          <Typography variant="h6" color={red[700]}>Total Expenses</Typography>
          <Typography variant="h4" sx={{ color: red[800] }}>${totalExpense.toFixed(2)}</Typography>
        </SummaryCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <SummaryCard elevation={3} sx={{ backgroundColor: blue[50] }}>
          <TrendingUp fontSize="large" sx={{ color: blue[500] }} />
          <Typography variant="h6" color={blue[700]}>Savings Rate</Typography>
          <Typography variant="h4" sx={{ color: blue[800] }}>{savingsRate.toFixed(2)}%</Typography>
        </SummaryCard>
      </Grid>
    </Grid>
  );
};

export default FinancialSummary;