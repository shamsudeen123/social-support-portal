import { createTheme } from '@mui/material/styles';

const getTheme = (mode, direction = 'ltr') =>
  createTheme({
    direction,
    palette: {
      mode,
      primary: { main: '#4338CA', light: '#6366F1', dark: '#3730A3', contrastText: '#fff' },
      secondary: { main: '#0D9488', light: '#14B8A6', dark: '#0F766E', contrastText: '#fff' },
      background: {
        default: mode === 'dark' ? '#0D0C1A' : '#F4F5FF',
        paper: mode === 'dark' ? '#18162B' : '#FFFFFF',
      },
      success: { main: '#2E7D32' },
      error: { main: '#C62828' },
    },
    typography: {
      fontFamily:
        direction === 'rtl'
          ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
          : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 500 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { margin: 0 },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '9px 22px',
          },
          containedPrimary: {
            boxShadow: '0 2px 8px rgba(67,56,202,0.30)',
            '&:hover': { boxShadow: '0 4px 14px rgba(67,56,202,0.45)' },
          },
          containedSuccess: {
            boxShadow: '0 2px 8px rgba(46,125,50,0.30)',
            '&:hover': { boxShadow: '0 4px 14px rgba(46,125,50,0.45)' },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'medium' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover fieldset': { borderColor: '#4338CA' },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark' ? '0 4px 24px rgba(99,102,241,0.12)' : '0 2px 16px rgba(67,56,202,0.08)',
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 6 } } },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
    },
  });

export default getTheme;
