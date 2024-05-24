import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Grid } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const role = decodedToken ? decodedToken.role : '';
  const userData = decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"] : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to the Dashboard
        </Typography>
        <Box mt={4}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                User Role: {role}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                User Data: {userData}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
