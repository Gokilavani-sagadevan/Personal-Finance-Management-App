// src/components/ProfileManagement.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
}

const ProfileManagement: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      // Load profile from localStorage or set default values
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile({
          username: user.username,
          email: user.email,
          fullName: '',
          phoneNumber: '',
        });
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    // TODO: In a real app, you would send this data to your backend
    alert('Profile updated successfully');
  };

  if (!user) {
    return <Typography>Please log in to view your profile.</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Profile Management
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            disabled
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled
          />
          <TextField
            margin="normal"
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfileManagement;