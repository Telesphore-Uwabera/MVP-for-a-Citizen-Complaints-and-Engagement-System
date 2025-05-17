import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';

const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - replace with actual API call
  const complaint = {
    id: id,
    title: 'Road Maintenance Issue',
    description: 'The main road in our neighborhood has been in poor condition for months.',
    status: 'In Progress',
    category: 'Infrastructure',
    priority: 'High',
    createdAt: '2024-02-15',
    location: 'Gasabo District, Kigali',
    updates: [
      {
        date: '2024-02-15',
        status: 'Received',
        description: 'Complaint has been received and is under review.',
      },
      {
        date: '2024-02-16',
        status: 'In Progress',
        description: 'Assessment team has been dispatched to the location.',
      },
    ],
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {complaint.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={complaint.status}
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={complaint.category}
                  color="secondary"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={complaint.priority}
                  color="error"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography paragraph>
                {complaint.description}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography paragraph>
                {complaint.location}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Submitted
              </Typography>
              <Typography paragraph>
                {complaint.createdAt}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Updates
              </Typography>
              <Timeline>
                {complaint.updates.map((update, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < complaint.updates.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">
                        {update.date} - {update.status}
                      </Typography>
                      <Typography>
                        {update.description}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="primary">
                  Add Update
                </Button>
                <Button variant="contained" color="primary">
                  Close Complaint
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ComplaintDetails; 