import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  variant?: 'default' | 'compact';
}

const Logo: React.FC<LogoProps> = ({ variant = 'default' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        CC
      </Box>
      {variant === 'default' && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Citizen Complaints
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 