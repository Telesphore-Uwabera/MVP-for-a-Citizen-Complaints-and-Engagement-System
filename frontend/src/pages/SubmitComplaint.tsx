import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ComplaintForm from '../components/ComplaintForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const SubmitComplaint = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Submit a New Complaint
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          Please provide detailed information about your complaint to help us address it effectively.
        </Typography>
        <ComplaintForm />
      </Box>
    </Container>
  );
};

export default SubmitComplaint; 