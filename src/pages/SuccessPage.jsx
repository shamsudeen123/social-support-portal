import React from 'react';
import {
  Box, Typography, Button, Paper, Chip, Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import TagIcon from '@mui/icons-material/Tag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useSelector, useDispatch } from 'react-redux';
import { resetForm } from '../slices/formSlice';
import { useTranslation } from 'react-i18next';

const SuccessPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { referenceNumber } = useSelector((s) => s.form);

  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '20px',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            display: 'block',
            height: 4,
            background: 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)',
          },
        }}
      >
        <Box sx={{ px: { xs: 3, sm: 4 }, pt: { xs: 3, sm: 3.5 }, pb: { xs: 3, sm: 3.5 } }}>

          {/* ── Check icon ── */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: [
                  `0 0 0  5px ${alpha(theme.palette.success.main, 0.14)}`,
                  `0 0 0 11px ${alpha(theme.palette.success.main, 0.07)}`,
                ].join(', '),
              }}
            >
              <CheckCircleIcon sx={{ color: '#fff', fontSize: 34 }} />
            </Box>
          </Box>

          {/* ── Heading ── */}
          <Typography variant="h6" fontWeight={800} color="success.main" gutterBottom>
            {t('submit.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.65} sx={{ mb: 2.5 }}>
            {t('submit.subtitle')}
          </Typography>

          <Divider sx={{ mb: 2.5 }} />

          {/* ── Reference card ── */}
          <Box
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.primary.main, 0.10)
                : alpha(theme.palette.primary.main, 0.06),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
              borderRadius: '12px',
              px: 2.5,
              py: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              textTransform="uppercase"
              letterSpacing={1.2}
            >
              {t('submit.referenceNumber')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: 0.75 }}>
              <TagIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={800} color="primary.main" letterSpacing={1.5}>
                {referenceNumber}
              </Typography>
            </Box>

            <Box sx={{ mt: 1.25 }}>
              <Chip
                label={t('submit.applicationReceived')}
                color="success"
                size="small"
                sx={{ fontWeight: 700, borderRadius: '6px' }}
              />
            </Box>
          </Box>

          {/* ── Info row ── */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              bgcolor: isDark ? alpha('#fff', 0.04) : alpha(theme.palette.primary.main, 0.03),
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              px: 2,
              py: 1.5,
              mb: 3,
              textAlign: 'left',
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.disabled', mt: 0.3, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.65}>
              {t('submit.message')}
            </Typography>
          </Box>

          {/* ── CTA ── */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(resetForm())}
            aria-label={t('submit.newApplication')}
          >
            {t('submit.newApplication')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SuccessPage;
