import { createTheme, Theme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

const getTheme = (mode: 'light' | 'dark', direction: 'ltr' | 'rtl' = 'ltr'): Theme =>
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
          },
          sizeSmall: { padding: '5px 14px', fontSize: '0.8125rem' },
          sizeMedium: { padding: '7px 18px' },
          sizeLarge: { padding: '9px 22px' },
          contained: {
            boxShadow: '0 2px 8px rgba(67,56,202,0.30)',
            '&:hover': { boxShadow: '0 4px 14px rgba(67,56,202,0.45)' },
            '&.MuiButton-colorSuccess': {
              boxShadow: '0 2px 8px rgba(46,125,50,0.30)',
              '&:hover': { boxShadow: '0 4px 14px rgba(46,125,50,0.45)' },
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'medium' },
      },
      MuiInputBase: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: theme.typography.fontFamily,
            '& input::placeholder, & textarea::placeholder': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.875rem',
              fontStyle: 'normal',
              fontWeight: 400,
              color: mode === 'dark' ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
              opacity: 1,
            },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            transition: 'box-shadow 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${mode === 'dark' ? 'rgba(99,102,241,0.25)' : 'rgba(67,56,202,0.15)'}`,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1.5px',
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-error': {
              boxShadow: 'none',
            },
          }),
          notchedOutline: {
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
            transition: 'border-color 0.2s ease',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
            '&.Mui-focused': {
              fontWeight: 600,
            },
          }),
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: theme.typography.fontFamily,
            marginTop: 4,
          }),
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

      MuiDateCalendar: {
        styleOverrides: {
          root: {
            fontFamily: direction === 'rtl'
              ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
              : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
            borderRadius: 16,
            width: 300,
          },
        },
      },

      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: { paddingLeft: 16, paddingRight: 8 },
          label: {
            fontFamily: direction === 'rtl'
              ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
              : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#4338CA',
          },
        },
      },

      MuiPickersArrowSwitcher: {
        styleOverrides: {
          button: {
            color: '#4338CA',
            '&:hover': {
              backgroundColor: mode === 'dark'
                ? 'rgba(99,102,241,0.15)'
                : 'rgba(67,56,202,0.08)',
            },
          },
        },
      },

      MuiDayCalendar: {
        styleOverrides: {
          weekDayLabel: {
            fontFamily: direction === 'rtl'
              ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
              : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
            fontWeight: 700,
            fontSize: '0.72rem',
            color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.38)',
          },
        },
      },

      MuiPickerDay: {
        styleOverrides: {
          root: {
            fontFamily: direction === 'rtl'
              ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
              : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
            fontWeight: 500,
            fontSize: '0.85rem',
            borderRadius: 8,
            transition: 'background-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(99,102,241,0.18)' : 'rgba(67,56,202,0.10)',
              transform: 'scale(1.08)',
            },
            '&.Mui-selected': {
              backgroundColor: '#4338CA',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(67,56,202,0.40)',
              '&:hover, &:focus': { backgroundColor: '#3730A3' },
            },
            '&.MuiPickerDay-today:not(.Mui-selected)': {
              border: '2px solid #4338CA',
              color: '#4338CA',
              fontWeight: 700,
              backgroundColor: mode === 'dark' ? 'rgba(99,102,241,0.10)' : 'rgba(67,56,202,0.06)',
            },
          },
        },
      },

      MuiYearCalendar: {
        styleOverrides: {
          button: {
            fontFamily: direction === 'rtl'
              ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
              : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
            fontWeight: 500,
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: '#4338CA',
              fontWeight: 700,
              '&:hover, &:focus': { backgroundColor: '#3730A3' },
            },
          },
        },
      },

      MuiMonthCalendar: {
        styleOverrides: {
          button: {
            fontFamily: direction === 'rtl'
              ? '"Noto Sans Arabic", "Segoe UI", sans-serif'
              : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
            fontWeight: 500,
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: '#4338CA',
              fontWeight: 700,
              '&:hover, &:focus': { backgroundColor: '#3730A3' },
            },
          },
        },
      },

      MuiPickerPopper: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.18)'
              : '0 8px 32px rgba(67,56,202,0.18), 0 0 0 1px rgba(67,56,202,0.10)',
            overflow: 'hidden',
          },
        },
      },
    },
  });

export default getTheme;
