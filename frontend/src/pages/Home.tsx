import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Report as ReportIcon,
  TrackChanges as TrackIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import rwandaLandscape from '../assets/rwanda-landscape.jpg';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'Submit Complaints',
      description: 'Report issues with public services and get them resolved quickly.',
      icon: <ReportIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Track Progress',
      description: 'Monitor the status of your complaints in real-time.',
      icon: <TrackIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Provide Feedback',
      description: 'Help improve public services by sharing your experience.',
      icon: <FeedbackIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Rwanda Citizen Engagement
              </Typography>
              <Typography variant="h5" paragraph>
                Your voice matters. Help us improve public services by sharing your feedback and concerns.
              </Typography>
              <Box sx={{ mt: 4 }}>
                {user ? (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/complaints/new')}
                      sx={{ mr: 2, mb: 2 }}
                    >
                      Submit a Complaint
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={() => navigate('/dashboard')}
                    >
                      View Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ mr: 2, mb: 2 }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={rwandaLandscape}
                alt="Beautiful Rwanda landscape"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                  objectFit: 'cover',
                  maxHeight: '400px'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mt: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join thousands of Rwandan citizens who are actively participating in improving public services.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {user ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/complaints/new')}
              >
                Submit a Complaint
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 