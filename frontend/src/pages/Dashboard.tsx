import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as ResolvedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: 'warning',
  in_progress: 'info',
  resolved: 'success',
  rejected: 'error',
} as const;

const statusIcons = {
  pending: <PendingIcon />,
  in_progress: <ErrorIcon />,
  resolved: <ResolvedIcon />,
  rejected: <ErrorIcon />,
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load complaints');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: 'Total Complaints',
      value: '12',
      color: 'primary.main',
    },
    {
      title: 'Pending',
      value: '5',
      color: 'warning.main',
    },
    {
      title: 'In Progress',
      value: '4',
      color: 'info.main',
    },
    {
      title: 'Resolved',
      value: '3',
      color: 'success.main',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Complaints
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/complaints/new')}
        >
          Submit New Complaint
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: stat.color,
                color: 'white',
              }}
            >
              <Typography component="h2" variant="h6" gutterBottom>
                {stat.title}
              </Typography>
              <Typography component="p" variant="h4">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Recent Complaints */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Complaints
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.description}</TableCell>
                      <TableCell>
                        <Chip
                          icon={statusIcons[complaint.status as keyof typeof statusIcons]}
                          label={complaint.status.replace('_', ' ')}
                          color={statusColors[complaint.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/complaints/${complaint.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 