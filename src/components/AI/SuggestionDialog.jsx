import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, CircularProgress,
  Alert, AlertTitle, Chip, IconButton, Divider, Link,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useTranslation } from 'react-i18next';

const ERROR_MAP = {
  NO_API_KEY:     { key: 'ai.errorNoKey',      severity: 'warning' },
  QUOTA_EXCEEDED: { key: 'ai.errorQuota',      severity: 'warning' },
  INVALID_KEY:    { key: 'ai.errorInvalidKey', severity: 'error'   },
  RATE_LIMIT:     { key: 'ai.errorRateLimit',  severity: 'info'    },
  TIMEOUT:        { key: 'ai.errorTimeout',    severity: 'error'   },
  API_ERROR:      { key: 'ai.errorGeneral',    severity: 'error'   },
};

const SuggestionDialog = ({
  open, loading, suggestion, error,
  provider = 'openai', onAccept, onDiscard, onRetry,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  React.useEffect(() => {
    if (suggestion) {
      setEditedText(suggestion);
      setEditMode(false);
    }
  }, [suggestion]);

  const handleAccept = () => onAccept(editMode ? editedText : suggestion);

  const errorMeta   = error ? (ERROR_MAP[error] || ERROR_MAP.API_ERROR) : null;
  const isQuotaError = error === 'QUOTA_EXCEEDED';
  const canRetry    = error && error !== 'NO_API_KEY' && error !== 'INVALID_KEY' && error !== 'QUOTA_EXCEEDED';

  const isGroq = provider === 'groq';
  const accentColor   = isGroq ? theme.palette.success.main : theme.palette.primary.main;
  const titleGradient = isGroq
    ? 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
    : 'linear-gradient(135deg, #3730A3 0%, #6366F1 100%)';

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onDiscard}
      maxWidth="sm"
      fullWidth
      aria-labelledby="ai-dialog-title"
      aria-describedby="ai-dialog-desc"
      PaperProps={{
        sx: {
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 24px 60px rgba(0,0,0,0.60)'
            : '0 20px 60px rgba(67,56,202,0.22)',
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle id="ai-dialog-title" sx={{ background: titleGradient, color: '#fff', p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3 }}>

          {/* Branded icon circle */}
          <Box sx={{
            width: 46, height: 46, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {isGroq
              ? <FlashOnIcon sx={{ fontSize: 24, color: '#fff' }} />
              : <AutoAwesomeIcon sx={{ fontSize: 24, color: '#fff' }} />}
          </Box>

          {/* Title + subtitle */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.3} color="inherit">
              {t('ai.suggestion')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
              {isGroq ? t('ai.suggestionSubtitleGroq') : t('ai.suggestionSubtitle')}
            </Typography>
          </Box>

          {/* Provider chip + close — grouped so they don't split */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Chip
              label={isGroq ? 'Groq' : 'OpenAI'}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.20)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 26,
                borderRadius: '6px',
              }}
            />
            {!loading && (
              <IconButton
                onClick={onDiscard}
                size="small"
                aria-label="Close"
                sx={{
                  color: 'rgba(255,255,255,0.80)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent sx={{ p: 0, bgcolor: 'background.paper' }}>

        {/* Loading */}
        {loading && (
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: 8, px: 4, gap: 3, textAlign: 'center',
          }}>
            {/* Spinner with icon at centre */}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={64} thickness={3} color={isGroq ? 'success' : 'primary'} />
              <Box sx={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isGroq
                  ? <FlashOnIcon sx={{ fontSize: 24, color: theme.palette.success.main }} />
                  : <AutoAwesomeIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />}
              </Box>
            </Box>

            <Box>
              <Typography variant="body1" fontWeight={700} color="text.primary" gutterBottom>
                {t('ai.generating')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isGroq ? 'Fast inference via Groq…' : 'Powered by OpenAI…'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Error */}
        {errorMeta && !loading && (
          <Box sx={{ px: 3, py: 3 }}>
            <Alert
              severity={errorMeta.severity}
              icon={isQuotaError ? <CreditCardIcon /> : undefined}
              sx={{ borderRadius: '12px', alignItems: 'flex-start', py: 1.5 }}
            >
              <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
                {isQuotaError ? t('ai.quotaErrorTitle') : t('ai.cannotGenerateTitle')}
              </AlertTitle>
              <Typography variant="body2" lineHeight={1.7}>{t(errorMeta.key)}</Typography>
              {isQuotaError && (
                <Box mt={1.5}>
                  <Link
                    href="https://platform.openai.com/account/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight={600}
                    underline="always"
                  >
                    {t('ai.addBillingLink')} →
                  </Link>
                </Box>
              )}
            </Alert>
          </Box>
        )}

        {/* Success */}
        {suggestion && !loading && !error && (
          <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
            {editMode ? (
              <TextField
                multiline
                fullWidth
                minRows={6}
                maxRows={12}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoFocus
                aria-label="Edit AI suggestion"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    lineHeight: 1.8,
                  },
                }}
              />
            ) : (
              <Box
                id="ai-dialog-desc"
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  bgcolor: alpha(accentColor, 0.05),
                  border: `1px solid ${alpha(accentColor, 0.16)}`,
                  borderLeft: `4px solid ${accentColor}`,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  lineHeight={1.9}
                  sx={{ fontSize: '0.9rem' }}
                >
                  {suggestion}
                </Typography>
              </Box>
            )}

            {/* Attribution */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              <Chip
                icon={isGroq
                  ? <FlashOnIcon sx={{ fontSize: '12px !important' }} />
                  : <AutoAwesomeIcon sx={{ fontSize: '12px !important' }} />}
                label={isGroq ? t('ai.poweredByGroq') : t('ai.poweredBy')}
                size="small"
                variant="outlined"
                color={isGroq ? 'success' : 'primary'}
                sx={{ fontSize: '0.68rem', height: 22 }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* ── Actions ── */}
      {!loading && (
        <>
          <Divider />
          <DialogActions sx={{ p: 0 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%', px: 3, py: 2.5, gap: 1,
            }}>

              {/* Discard — text button so it doesn't compete with primary actions */}
              <Button
                onClick={onDiscard}
                variant="text"
                color="inherit"
                startIcon={<CloseIcon sx={{ fontSize: '18px !important' }} />}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.06),
                    color: 'error.main',
                  },
                }}
              >
                {t('ai.discard')}
              </Button>

              {/* Right group */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {canRetry && onRetry && (
                  <Button
                    onClick={onRetry}
                    variant="outlined"
                    color={isGroq ? 'success' : 'primary'}
                    startIcon={<RefreshIcon />}
                  >
                    {t('ai.retry')}
                  </Button>
                )}

                {suggestion && !error && (
                  <>
                    {!editMode && (
                      <Button
                        onClick={() => setEditMode(true)}
                        variant="outlined"
                        color={isGroq ? 'success' : 'primary'}
                        startIcon={<EditIcon />}
                      >
                        {t('ai.edit')}
                      </Button>
                    )}
                    <Button
                      onClick={handleAccept}
                      variant="contained"
                      color={isGroq ? 'success' : 'primary'}
                      startIcon={<CheckIcon />}
                    >
                      {t('ai.accept')}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default SuggestionDialog;
