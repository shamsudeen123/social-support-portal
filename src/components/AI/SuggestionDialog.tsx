import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, CircularProgress,
  Alert, AlertTitle, Chip, IconButton, Divider, Link, useMediaQuery,
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

interface Props {
  open: boolean;
  loading: boolean;
  suggestion: string;
  error: string;
  errorMessage?: string;
  provider?: string;
  onAccept: (text: string) => void;
  onDiscard: () => void;
  onRetry: () => void;
}

const ERROR_MAP: Record<string, { key: string; severity: 'error' | 'warning' | 'info' | 'success' }> = {
  NO_API_KEY: { key: 'ai.errorNoKey', severity: 'warning' },
  QUOTA_EXCEEDED: { key: 'ai.errorQuota', severity: 'warning' },
  INVALID_KEY: { key: 'ai.errorInvalidKey', severity: 'error' },
  RATE_LIMIT: { key: 'ai.errorRateLimit', severity: 'info' },
  TIMEOUT: { key: 'ai.errorTimeout', severity: 'error' },
  API_ERROR: { key: 'ai.errorGeneral', severity: 'error' },
};

const SuggestionDialog = ({
  open, loading, suggestion, error, errorMessage = '',
  provider = 'openai', onAccept, onDiscard, onRetry,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (suggestion) {
      setEditedText(suggestion);
      setEditMode(false);
    }
  }, [suggestion]);

  const handleAccept = () => onAccept(editMode ? editedText : suggestion);

  const errorMeta = error ? (ERROR_MAP[error] || ERROR_MAP.API_ERROR) : null;
  const isQuotaError = error === 'QUOTA_EXCEEDED';
  const canRetry = error && error !== 'NO_API_KEY' && error !== 'INVALID_KEY' && error !== 'QUOTA_EXCEEDED';

  const isGroq = provider === 'groq';
  const accentColor = isGroq ? theme.palette.success.main : theme.palette.primary.main;
  const titleGradient = isGroq
    ? 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
    : 'linear-gradient(135deg, #3730A3 0%, #6366F1 100%)';

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onDiscard}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="ai-dialog-title"
      aria-describedby="ai-dialog-desc"
      slotProps={{
        paper: {
          sx: {
            overflow: 'hidden',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 24px 60px rgba(0,0,0,0.60)'
              : '0 20px 60px rgba(67,56,202,0.22)',
            ...(isMobile && { borderRadius: 0 }),
          },
        },
      }}
    >
      <DialogTitle id="ai-dialog-title" sx={{ background: titleGradient, color: '#fff', p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3 }}>
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" color="inherit" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {t('ai.suggestion')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
              {isGroq ? t('ai.suggestionSubtitleGroq') : t('ai.suggestionSubtitle')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Chip
              label={isGroq ? t('ai.providerGroq') : t('ai.providerOpenAI')}
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
                aria-label={t('aria.close')}
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

      <DialogContent sx={{ p: 0, bgcolor: 'background.paper' }}>
        {loading && (
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: { xs: 6, sm: 8 }, px: { xs: 3, sm: 4 }, gap: 3, textAlign: 'center',
          }}>
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
              <Typography variant="body1" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                {t('ai.generating')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isGroq ? t('ai.loadingGroq') : t('ai.loadingOpenAI')}
              </Typography>
            </Box>
          </Box>
        )}

        {errorMeta && !loading && (
          <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
            <Alert
              severity={errorMeta.severity}
              icon={isQuotaError ? <CreditCardIcon /> : undefined}
              sx={{ borderRadius: '12px', alignItems: 'flex-start', py: 1.5 }}
            >
              <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
                {isQuotaError ? t('ai.quotaErrorTitle') : t('ai.cannotGenerateTitle')}
              </AlertTitle>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {error === 'API_ERROR' && errorMessage ? errorMessage : t(errorMeta.key)}
              </Typography>
              {isQuotaError && (
                <Box sx={{ mt: 1.5 }}>
                  <Link
                    href="https://platform.openai.com/account/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontWeight: 600 }}
                    underline="always"
                  >
                    {t('ai.addBillingLink')} →
                  </Link>
                </Box>
              )}
              {errorMessage && error !== 'API_ERROR' && (
                <Box sx={{ mt: 1.5, px: 1.5, py: 1, borderRadius: 1.5, bgcolor: 'rgba(0,0,0,0.06)' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace', fontSize: '0.7rem',
                      color: 'text.secondary', wordBreak: 'break-all',
                      display: 'block', lineHeight: 1.6,
                    }}
                  >
                    {errorMessage}
                  </Typography>
                </Box>
              )}
            </Alert>
          </Box>
        )}

        {suggestion && !loading && !error && (
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 } }}>
            {editMode ? (
              <TextField
                multiline
                fullWidth
                minRows={isMobile ? 5 : 6}
                maxRows={isMobile ? 10 : 14}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoFocus
                aria-label={t('aria.editSuggestion')}
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
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.9, fontSize: '0.9rem' }}>
                  {suggestion}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      {!loading && (
        <>
          <Divider />
          <DialogActions sx={{ p: 0 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              width: '100%',
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2.5 },
              gap: { xs: 1, sm: 1 },
            }}>
              <Button
                onClick={onDiscard}
                variant="text"
                color="inherit"
                fullWidth={isMobile}
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

              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 1.5 },
                alignItems: 'stretch',
              }}>
                {canRetry && onRetry && (
                  <Button
                    onClick={onRetry}
                    variant="outlined"
                    color={isGroq ? 'success' : 'primary'}
                    fullWidth={isMobile}
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
                        fullWidth={isMobile}
                        startIcon={<EditIcon />}
                      >
                        {t('ai.edit')}
                      </Button>
                    )}
                    <Button
                      onClick={handleAccept}
                      variant="contained"
                      color={isGroq ? 'success' : 'primary'}
                      fullWidth={isMobile}
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
