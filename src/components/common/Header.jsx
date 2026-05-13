import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box,
  Tooltip, Chip, useMediaQuery, Container,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setLanguage } from '../../slices/uiSlice';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const dispatch = useDispatch();
  const { themeMode, language } = useSelector((s) => s.ui);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLang = () => {
    const next = language === 'en' ? 'ar' : 'en';
    dispatch(setLanguage(next));
    i18n.changeLanguage(next);
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : '#ffffff',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="md" disableGutters>
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 2, sm: 3 },
            height: 64,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* ── Brand ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AccountBalanceIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                lineHeight={1.2}
                color="text.primary"
                noWrap
              >
                {t('appTitle')}
              </Typography>
              {!isMobile && (
                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.3}>
                  {t('appSubtitle')}
                </Typography>
              )}
            </Box>
          </Box>

          {/* ── Controls ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Tooltip title={language === 'en' ? 'عربي' : 'English'}>
              <Chip
                icon={<TranslateIcon sx={{ fontSize: '14px !important' }} />}
                label={language === 'en' ? 'AR' : 'EN'}
                onClick={handleLang}
                variant="outlined"
                size="small"
                aria-label="Toggle language"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  height: 28,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiChip-icon': { color: '#fff' },
                  },
                }}
              />
            </Tooltip>

            <Tooltip title={themeMode === 'dark' ? t('theme.light') : t('theme.dark')}>
              <IconButton
                onClick={() => dispatch(toggleTheme())}
                size="small"
                aria-label="Toggle theme"
                sx={{ color: 'text.secondary' }}
              >
                {themeMode === 'dark'
                  ? <Brightness7Icon sx={{ fontSize: 20 }} />
                  : <Brightness4Icon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
