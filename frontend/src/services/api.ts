import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://13.233.155.152:8080/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Transaction {
  id?: number;
  amount: number;
  category: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Budget {
  id?: number;
  category: string;
  amount: number;
  period: 'MONTHLY' | 'YEARLY';
}

const api = {
  exportData: async () => {
    const transactions = await api.getAllTransactions();
    const budgets = await api.getAllBudgets();
    return { transactions, budgets };
  },

  register: async (userData: { username: string; email: string; password: string }): Promise<void> => {
    console.log('Sending registration request to:', `${API_URL}/auth/register`);
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Registration response:', response);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await axiosInstance.get('/transactions');
    return response.data;
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await axiosInstance.post('/transactions', transaction);
    return response.data;
  },

  updateTransaction: async (transaction: Transaction): Promise<Transaction> => {
    const response = await axiosInstance.put(`/transactions/${transaction.id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/transactions/${id}`);
  },

  getAllBudgets: async (): Promise<Budget[]> => {
    const response = await axiosInstance.get('/budgets');
    return response.data;
  },

  addBudget: async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
    const response = await axiosInstance.post('/budgets', budget);
    return response.data;
  },

  updateBudget: async (budget: Budget): Promise<Budget> => {
    const response = await axiosInstance.put(`/budgets/${budget.id}`, budget);
    return response.data;
  },

  deleteBudget: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/budgets/${id}`);
  },

  getUserSettings: async () => {
    const response = await axiosInstance.get('/users/settings');
    return response.data;
  },

  updateEmailNotifications: async (enabled: boolean) => {
    const response = await axiosInstance.put('/users/email-notifications', { enabled });
    return response.data;
  },
};

export default api;