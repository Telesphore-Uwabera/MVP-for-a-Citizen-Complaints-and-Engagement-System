import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  priority: string;
  attachments: string[];
  user_id: string;
  agency_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/complaints`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Complaints
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/submit-complaint')}
        >
          Submit New Complaint
        </Button>
      </Box>

      {complaints.length === 0 ? (
        <Typography variant="h6" textAlign="center">No complaints submitted yet.</Typography>
      ) : (
        <Box>
          {complaints.map(complaint => (
            <Card key={complaint.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{complaint.title}</Typography>
                <Typography variant="body2" color="text.secondary">Category: {complaint.category}</Typography>
                <Typography variant="body2" color="text.secondary">Status: {complaint.status}</Typography>
                <Typography variant="body2" color="text.secondary">Priority: {complaint.priority}</Typography>
                <Button size="small" onClick={() => navigate(`/complaints/${complaint.id}`)}>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 