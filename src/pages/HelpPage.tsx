import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';

const helpCards = [
  { icon: AssignmentIcon, title: 'help.whatToDo.title', body: 'help.whatToDo.body' },
  { icon: ChecklistIcon, title: 'help.howToDo.title', body: 'help.howToDo.body' },
  { icon: TipsAndUpdatesIcon, title: 'help.tips.title', body: 'help.tips.body' },
];

const HelpPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { language } = useSelector((s: RootState) => s.ui);
  const isRTL = language === 'ar';
  const BackIcon = isRTL ? ArrowForwardIcon : ArrowBackIcon;
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="main"
      role="main"
      sx={{
        py: { xs: 1.5, sm: 2.5 },
        minHeight: 'calc(100dvh - 64px)',
      }}
    >
      <Container maxWidth="md" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: isDark ? '0 10px 34px rgba(0,0,0,0.24)' : '0 10px 30px rgba(67,56,202,0.08)',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              bgcolor: isDark ? alpha('#fff', 0.02) : alpha(theme.palette.primary.main, 0.025),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1),
                  flexShrink: 0,
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: 19 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {t('help.badge')}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  noWrap
                  sx={{ fontWeight: 800, lineHeight: 1.25 }}
                >
                  {t('help.title')}
                </Typography>
              </Box>
            </Box>

            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              size="small"
              startIcon={<BackIcon />}
              sx={{ flexShrink: 0 }}
            >
              {t('help.backToApplication')}
            </Button>
          </Box>

          <Box sx={{ px: { xs: 2, sm: 4 }, pt: { xs: 2.25, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.78fr) minmax(0, 1.22fr)' },
                gap: { xs: 2.25, md: 4 },
                alignItems: 'start',
              }}
            >
              <Box>
                <Chip
                  label={t('help.aboutTitle')}
                  size="small"
                  color="primary"
                  sx={{ borderRadius: '6px', fontWeight: 800, mb: 1.5 }}
                />
                <Typography
                  variant="h5"
                  color="primary.main"
                  sx={{ fontWeight: 800, lineHeight: 1.25, fontSize: { xs: '1.35rem', sm: '1.75rem' } }}
                >
                  {t('help.title')}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>
                  {t('help.intro')}
                </Typography>
                <Divider sx={{ my: 2.25 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {t('help.aboutBody')}
                </Typography>
              </Box>

              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: isDark ? alpha('#fff', 0.025) : '#fff',
                }}
              >
                {helpCards.map(({ icon: Icon, title, body }, index) => (
                  <Box
                    key={title}
                    sx={{
                      display: 'flex',
                      gap: 1.75,
                      p: { xs: 2, sm: 2.25 },
                      borderBottom: index < helpCards.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    }}
                  >
                    <Box sx={{ position: 'relative', flexShrink: 0 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          bgcolor: index === 1 ? 'secondary.main' : 'primary.main',
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          right: isRTL ? 'auto' : -5,
                          left: isRTL ? -5 : 'auto',
                          bottom: -5,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'background.paper',
                          border: `1px solid ${theme.palette.divider}`,
                          color: 'text.secondary',
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
                        {t(title)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                        {t(body)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              px: { xs: 2, sm: 4 },
              py: { xs: 2, sm: 2.5 },
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.secondary.main, isDark ? 0.11 : 0.065),
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                flexShrink: 0,
              }}
            >
              <ChecklistIcon sx={{ fontSize: 19 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.35 }}>
                {t('help.needTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {t('help.needBody')}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpPage;
