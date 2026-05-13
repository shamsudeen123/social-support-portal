import React from 'react';
import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import FormWizard from '../components/FormWizard/FormWizard';
import SuccessPage from './SuccessPage';

const ApplicationPage = () => {
  const { isSubmitted } = useSelector((s) => s.form);

  return (
    <Box
      component="main"
      role="main"
      sx={{
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 2, sm: 2.5 },
      }}
    >
      <Container
        maxWidth="md"
        disableGutters
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}
      >
        {isSubmitted ? <SuccessPage /> : <FormWizard />}
      </Container>
    </Box>
  );
};

export default ApplicationPage;
