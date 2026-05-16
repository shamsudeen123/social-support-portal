import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box,
  Tooltip, useMediaQuery, Container,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { toggleTheme, setLanguage } from '../../slices/uiSlice';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';

const Header = () => {
  const dispatch = useDispatch();
  const { themeMode, language } = useSelector((s: RootState) => s.ui);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

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
        bgcolor: isDark ? 'rgba(13,12,26,0.88)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? '0 1px 0 rgba(255,255,255,0.04)'
          : '0 1px 12px rgba(67,56,202,0.07)',
      }}
    >
      <Container maxWidth="md" disableGutters>
        <Toolbar
          disableGutters
          sx={{ px: { xs: 2, sm: 3 }, height: 64, display: 'flex', alignItems: 'center' }}
        >

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>

            <Box
              component="img"
              src="/favicon.svg"
              alt=""
              sx={{
                width: 38, height: 38,
                borderRadius: '10px',
                flexShrink: 0,
                boxShadow: '0 2px 10px rgba(67,56,202,0.38)',
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                noWrap
                sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' }}
              >
                {t('appTitle')}
              </Typography>

              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                  <Box
                    sx={{
                      width: 6, height: 6, borderRadius: '50%',
                      bgcolor: 'success.main',
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.success.main, 0.22)}`,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ lineHeight: 1.3, fontSize: '0.7rem' }}
                  >
                    {t('appSubtitle')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
            <Tooltip title={t('help.nav')} placement="bottom">
              <Box
                component={RouterLink}
                to="/help"
                aria-label={t('help.nav')}
                sx={{
                  height: 34,
                  minWidth: { xs: 34, sm: 72 },
                  px: { xs: 0, sm: 1.1 },
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.65,
                  color: 'text.secondary',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${alpha(theme.palette.primary.main, 0.45)}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: 19, flexShrink: 0 }} />
                {!isMobile && (
                  <Typography
                    component="span"
                    sx={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1 }}
                  >
                    {t('help.nav')}
                  </Typography>
                )}
              </Box>
            </Tooltip>

            <Tooltip title={language === 'en' ? 'عربي' : 'English'} placement="bottom">
              <Box
                onClick={handleLang}
                role="button"
                tabIndex={0}
                aria-label={t('aria.toggleLanguage')}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleLang()}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.6,
                  px: 1.25, py: 0.5,
                  borderRadius: '20px',
                  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                  color: 'primary.main',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    borderColor: 'primary.main',
                    color: '#fff',
                    '& svg': { color: '#fff' },
                  },
                }}
              >
                <TranslateIcon sx={{ fontSize: 13, color: 'inherit', transition: 'color 0.2s' }} />
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, lineHeight: 1, color: 'inherit' }}>
                  {language === 'en' ? 'AR' : 'EN'}
                </Typography>
              </Box>
            </Tooltip>

            <Box sx={{ width: 1, height: 20, bgcolor: 'divider', mx: 0.25 }} />

            <Tooltip
              title={themeMode === 'dark' ? t('theme.light') : t('theme.dark')}
              placement="bottom"
            >
              <IconButton
                onClick={() => dispatch(toggleTheme())}
                size="small"
                aria-label={t('aria.toggleTheme')}
                sx={{
                  color: 'text.secondary',
                  borderRadius: '8px',
                  p: '7px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  },
                }}
              >
                {themeMode === 'dark'
                  ? <Brightness7Icon sx={{ fontSize: 19 }} />
                  : <Brightness4Icon sx={{ fontSize: 19 }} />}
              </IconButton>
            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
