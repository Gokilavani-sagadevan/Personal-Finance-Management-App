import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Switch, FormControlLabel, Button, Paper } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import { ColorModeContext } from '../App';
import api from '../services/api';
import axios from 'axios';

const Settings: React.FC = () => {
  const { showNotification } = useNotification();
  const colorMode = useContext(ColorModeContext);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await api.getUserSettings();
        setEmailNotifications(response.emailNotificationsEnabled);
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
        showNotification('Failed to load user settings', 'error');
      }
    };

    fetchUserSettings();
  }, []);

  const handleEmailNotificationsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setEmailNotifications(newValue);

    try {
      await api.updateEmailNotifications(newValue);
      console.log('Successfully updated email notifications');
      showNotification('Email notification settings updated', 'success');
    } catch (error) {
      console.error('Failed to update email notifications:', error);
      let errorMessage = 'Failed to update email notifications';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage += ': ' + error.response.data;
      }
      showNotification(errorMessage, 'error');
      setEmailNotifications(!newValue);
    }
  };

  const handleSave = () => {
    showNotification('Settings saved successfully', 'success');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={handleEmailNotificationsChange}
              />
            }
            label="Email Notifications"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch onChange={colorMode.toggleColorMode} />
            }
            label="Dark Mode"
          />
        </Box>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;