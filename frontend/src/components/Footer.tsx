import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" color="text.secondary" align="center">
          © {new Date().getFullYear()} RCE. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 