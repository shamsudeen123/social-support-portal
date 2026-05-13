import React from 'react';
import {
  Box, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses,
  Typography, useMediaQuery,
} from '@mui/material';
import { useTheme, styled, alpha } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

const ICONS = [PersonIcon, FamilyRestroomIcon, DescriptionIcon];
const TOTAL = 3;

/*
 * Share currentStep with CustomStepIcon without prop-drilling through MUI internals.
 * In MUI v9, StepIconComponent may not reliably forward the `completed` prop,
 * so we derive it from the context-provided currentStep instead.
 */
const StepCtx = React.createContext(0);

/* ── Connector: solid block so gradient backgrounds work ── */
const ColoredConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,                      // 32px icon / 2 - 1.5px (half of 3px line) = 14.5 ≈ 15
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    display: 'block',
    border: 'none',
    height: 3,
    borderRadius: 4,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : '#E4E5FF',
    transition: 'background 0.4s ease',
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.success.main,
  },
}));

/* ── Step icon — derives its own completed/active from context ── */
const CustomStepIcon = ({ icon }) => {
  const theme = useTheme();
  const currentStep = React.useContext(StepCtx);
  const isDark = theme.palette.mode === 'dark';

  const index     = icon - 1;          // MUI passes 1-based icon number
  const completed = index < currentStep;
  const active    = index === currentStep;
  const Icon      = ICONS[index];

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',

        /* completed — solid green */
        ...(completed && {
          bgcolor: 'success.main',
          color: '#fff',
          boxShadow: `0 2px 10px ${alpha(theme.palette.success.main, 0.45)}`,
        }),

        /* active — indigo with glow ring */
        ...(active && {
          bgcolor: 'primary.main',
          color: '#fff',
          transform: 'scale(1.14)',
          boxShadow: [
            `0 0 0 5px ${alpha(theme.palette.primary.main, 0.16)}`,
            `0 4px 12px ${alpha(theme.palette.primary.main, 0.38)}`,
          ].join(', '),
        }),

        /* pending — ghost outline */
        ...(!completed && !active && {
          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#F0F1FF',
          color: 'text.disabled',
          border: `2px solid ${isDark ? 'rgba(255,255,255,0.10)' : '#D8DCFF'}`,
        }),
      }}
    >
      {completed
        ? <CheckIcon sx={{ fontSize: 15 }} />
        : <Icon sx={{ fontSize: 15, opacity: active ? 1 : 0.45 }} />}
    </Box>
  );
};

/* ── ProgressStepper ── */
const ProgressStepper = ({ currentStep }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

  const pct = Math.round((currentStep / TOTAL) * 100);

  const steps = [
    t('steps.personalInfo'),
    t('steps.familyFinancial'),
    t('steps.situationDesc'),
  ];

  return (
    <StepCtx.Provider value={currentStep}>
      <Box sx={{ mb: 2 }}>

        {/* ── Header row ── */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            px: 0.5,
          }}
        >
          {/* Step number badge + label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 22, height: 22, borderRadius: '50%',
                bgcolor: 'primary.main', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
              }}
            >
              {currentStep + 1}
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {t('progress.step', { current: currentStep + 1, total: TOTAL })}
            </Typography>
          </Box>

          {/* Mini progress bar + percentage */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 52, height: 4, borderRadius: 3,
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#E4E5FF',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 3,
                  background: pct === 0
                    ? 'transparent'
                    : 'linear-gradient(90deg, #3730A3 0%, #6366F1 100%)',
                  transition: 'width 0.5s ease',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              fontWeight={700}
              color={pct === 100 ? 'success.main' : 'primary.main'}
              sx={{ minWidth: 28 }}
            >
              {pct}%
            </Typography>
          </Box>
        </Box>

        {/* ── Stepper ── */}
        <Stepper activeStep={currentStep} alternativeLabel connector={<ColoredConnector />}>
          {steps.map((label, index) => (
            <Step key={label} completed={index < currentStep}>
              <StepLabel
                slots={{ stepIcon: CustomStepIcon }}
                sx={{
                  '& .MuiStepLabel-iconContainer': { pb: 0 },
                  '& .MuiStepLabel-label': {
                    mt: 1,
                    fontSize: { xs: '0.68rem', sm: '0.75rem' },
                    fontWeight: index === currentStep ? 700 : 400,
                    lineHeight: 1.3,
                    color:
                      index === currentStep
                        ? 'primary.main'
                        : index < currentStep
                        ? 'success.main'
                        : 'text.disabled',
                    display: isMobile && index !== currentStep ? 'none' : 'block',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </StepCtx.Provider>
  );
};

export default ProgressStepper;
