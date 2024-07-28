import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import FinancialCharts from './FinancialCharts';
import DateRangeFilter from './DateRangeFilter';
import FinancialSummary from './FinancialSummary';
import DataExport from './DataExport';
import LoanCalculator from './LoanCalculator';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import api, { Transaction, Budget } from '../services/api';

const DashboardHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      const data = await api.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      showNotification('Failed to fetch transactions', 'error');
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await api.getAllBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      showNotification('Failed to fetch budgets', 'error');
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    if (startDate) {
      filtered = filtered.filter(t => t.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(t => t.date <= endDate);
    }
    setFilteredTransactions(filtered);
  };

  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const addedTransaction = await api.addTransaction(newTransaction);
      setTransactions([...transactions, addedTransaction]);
      showNotification('Transaction added successfully', 'success');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showNotification('Failed to add transaction', 'error');
    }
  };

  const updateTransaction = async (id: number, updatedTransaction: Partial<Transaction>) => {
    try {
      const transactionToUpdate: Transaction = {
        ...transactions.find(t => t.id === id)!,
        ...updatedTransaction,
        id
      };
      const updated = await api.updateTransaction(transactionToUpdate);
      setTransactions(transactions.map(t => t.id === id ? updated : t));
      showNotification('Transaction updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update transaction:', error);
      showNotification('Failed to update transaction', 'error');
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      showNotification('Transaction deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      showNotification('Failed to delete transaction', 'error');
    }
  };

  const addBudget = async (newBudget: Omit<Budget, 'id'>) => {
    try {
      const addedBudget = await api.addBudget(newBudget);
      setBudgets([...budgets, addedBudget]);
      showNotification('Budget added successfully', 'success');
    } catch (error) {
      console.error('Failed to add budget:', error);
      showNotification('Failed to add budget', 'error');
    }
  };

  const updateBudget = async (id: number, updatedBudget: Partial<Budget>) => {
    try {
      const budgetToUpdate: Budget = {
        ...budgets.find(b => b.id === id)!,
        ...updatedBudget,
        id
      };
      const updated = await api.updateBudget(budgetToUpdate);
      setBudgets(budgets.map(b => b.id === id ? updated : b));
      showNotification('Budget updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update budget:', error);
      showNotification('Failed to update budget', 'error');
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      await api.deleteBudget(id);
      setBudgets(budgets.filter(b => b.id !== id));
      showNotification('Budget deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete budget:', error);
      showNotification('Failed to delete budget', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout failed:', error);
      showNotification('Logout failed', 'error');
    }
  };

  return (
    <Container maxWidth="xl">
      <DashboardHeader>
        <Typography variant="h1" gutterBottom>{user?.username}'s Financial Dashboard</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Welcome, {user?.username}</Typography>
          <Box>
            <Button component={Link} to="/profile" variant="contained" color="secondary" sx={{ mr: 2 }}>
              Profile
            </Button>
            <Button component={Link} to="/settings" variant="contained" color="secondary" sx={{ mr: 2 }}>
              Settings
            </Button>
            <Button onClick={handleLogout} variant="contained" color="secondary">
              Logout
            </Button>
          </Box>
        </Box>
      </DashboardHeader>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledPaper>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <FinancialSummary transactions={filteredTransactions} />
        </Grid>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <FinancialCharts transactions={filteredTransactions} budgets={budgets} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h2" gutterBottom>Add Transaction</Typography>
            <TransactionForm onAddTransaction={addTransaction} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h2" gutterBottom>Transactions</Typography>
            <TransactionList
              transactions={filteredTransactions}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h2" gutterBottom>Budgets</Typography>
            <BudgetForm onAddBudget={addBudget} />
            <Box mt={3}>
              <BudgetList
                budgets={budgets}
                onUpdateBudget={updateBudget}
                onDeleteBudget={deleteBudget}
              />
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h2" gutterBottom>Loan Calculator</Typography>
            <LoanCalculator />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <DataExport transactions={transactions} budgets={budgets} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;