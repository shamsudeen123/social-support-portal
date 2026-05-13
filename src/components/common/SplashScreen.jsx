import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { useTheme, alpha, keyframes } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useTranslation } from 'react-i18next';
import AppleSpinner from './AppleSpinner';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.40), 0 8px 32px rgba(67,56,202,0.45); }
  50%       { box-shadow: 0 0 0 14px rgba(99,102,241,0), 0 8px 32px rgba(67,56,202,0.45); }
`;

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SplashScreen = ({ onDone }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.palette.mode === 'dark';
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(hide);
  }, []);

  return (
    <Fade in={visible} timeout={500} onExited={onDone} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          background: isDark
            ? 'radial-gradient(ellipse at 50% 40%, #1e1b40 0%, #0D0C1A 70%)'
            : 'radial-gradient(ellipse at 50% 40%, #eceeff 0%, #F4F5FF 70%)',
        }}
      >
        {/* ── Logo mark ── */}
        <Box
          sx={{
            width: 80, height: 80,
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #3730A3 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            animation: `${pulse} 2s ease-in-out infinite`,
            mb: 3.5,
          }}
        >
          <AccountBalanceIcon sx={{ color: '#fff', fontSize: 38 }} />
        </Box>

        {/* ── App name ── */}
        <Typography
          variant="h5"
          fontWeight={800}
          color="text.primary"
          sx={{
            letterSpacing: '-0.02em',
            animation: `${floatUp} 0.6s ease forwards`,
            animationDelay: '0.1s',
            opacity: 0,
          }}
        >
          {t('appTitle')}
        </Typography>

        {/* ── Tagline ── */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.75,
            mb: 5,
            animation: `${floatUp} 0.6s ease forwards`,
            animationDelay: '0.2s',
            opacity: 0,
          }}
        >
          {t('appSubtitle')}
        </Typography>

        {/* ── Loading indicator ── */}
        <Box
          sx={{
            animation: `${floatUp} 0.6s ease forwards`,
            animationDelay: '0.4s',
            opacity: 0,
          }}
        >
          <AppleSpinner size={32} />
        </Box>

        {/* ── Bottom branding ── */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            animation: `${floatUp} 0.6s ease forwards`,
            animationDelay: '0.5s',
            opacity: 0,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: alpha(theme.palette.text.secondary, 0.5), fontSize: '0.68rem' }}
          >
            {t('splash.poweredBy')}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
