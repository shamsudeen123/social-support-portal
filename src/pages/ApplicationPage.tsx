import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import FormWizard from '../components/FormWizard/FormWizard';
import SuccessPage from './SuccessPage';
import { RootState } from '../store';

const ApplicationPage = () => {
  const { isSubmitted } = useSelector((s: RootState) => s.form);

  return (
    <Box
      component="main"
      role="main"
      sx={{
        height: { sm: 'calc(100dvh - 64px)' },
        overflow: { sm: 'hidden' },
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 1.5, sm: 2.5 },
      }}
    >
      <Container
        maxWidth="md"
        disableGutters
        sx={{
          flex: { sm: 1 },
          display: 'flex',
          flexDirection: 'column',
          overflow: { sm: 'hidden' },
          minHeight: { sm: 0 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {isSubmitted ? <SuccessPage /> : <FormWizard />}
      </Container>
    </Box>
  );
};

export default ApplicationPage;
