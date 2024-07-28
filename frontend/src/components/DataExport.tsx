import React from 'react';
import { Button } from '@mui/material';
import { Transaction, Budget } from '../services/api'; // Make sure this path is correct

interface DataExportProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const DataExport: React.FC<DataExportProps> = ({ transactions, budgets }) => {
  const handleExport = () => {
    const data = {
      transactions,
      budgets
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'financial_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExport}>
      Export Data
    </Button>
  );
};

export default DataExport;