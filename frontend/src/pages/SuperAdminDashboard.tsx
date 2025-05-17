import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Tabs,
  Tab,
  SelectChangeEvent,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  nationalId: string;
  simCard: string;
  role: 'citizen' | 'agency_admin' | 'system_admin';
  isActive: boolean;
}

interface Agency {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  adminId: string;
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'user' | 'agency'>('user');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nationalId: '',
    simCard: '',
    role: 'citizen',
    agencyName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, agenciesRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch('http://localhost:5000/api/admin/agencies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      if (!usersRes.ok || !agenciesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [usersData, agenciesData] = await Promise.all([
        usersRes.json(),
        agenciesRes.json(),
      ]);

      setUsers(usersData);
      setAgencies(agenciesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'user' | 'agency') => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      email: '',
      name: '',
      nationalId: '',
      simCard: '',
      role: 'citizen',
      agencyName: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = dialogType === 'user' 
        ? 'http://localhost:5000/api/admin/users'
        : 'http://localhost:5000/api/admin/agencies';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create');
      }

      setSuccess(`${dialogType === 'user' ? 'User' : 'Agency'} created successfully`);
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(`Failed to create ${dialogType}`);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      setSuccess('User status updated successfully');
      fetchData();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Super Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Users" />
          <Tab label="Agencies" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Users Management</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog('user')}
                >
                  Add New User
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>National ID</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.nationalId}</TableCell>
                        <TableCell>{user.simCard}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
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
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Agencies Management</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog('agency')}
                >
                  Add New Agency
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Contact Email</TableCell>
                      <TableCell>Contact Phone</TableCell>
                      <TableCell>Admin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agencies.map((agency) => (
                      <TableRow key={agency.id}>
                        <TableCell>{agency.name}</TableCell>
                        <TableCell>{agency.description}</TableCell>
                        <TableCell>{agency.contactEmail}</TableCell>
                        <TableCell>{agency.contactPhone}</TableCell>
                        <TableCell>
                          {users.find(u => u.id === agency.adminId)?.name || 'Not Assigned'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'user' ? 'Add New User' : 'Add New Agency'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'user' ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="National ID"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Phone Number"
                name="simCard"
                value={formData.simCard}
                onChange={handleFormChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="citizen">Citizen</MenuItem>
                  <MenuItem value="agency_admin">Agency Admin</MenuItem>
                  <MenuItem value="system_admin">System Admin</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Agency Name"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contact Email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleFormChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuperAdminDashboard; 