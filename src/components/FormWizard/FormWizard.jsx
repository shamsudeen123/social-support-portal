import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, Button, Typography, Fade } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { nextStep, prevStep, updateFormData, submitForm } from '../../slices/formSlice';
import { showSaveIndicator } from '../../slices/uiSlice';
import ProgressStepper from './ProgressStepper';
import Step1PersonalInfo from '../steps/Step1PersonalInfo';
import Step2FamilyFinancial from '../steps/Step2FamilyFinancial';
import Step3SituationDesc from '../steps/Step3SituationDesc';
import AppleSpinner from '../common/AppleSpinner';

const STEPS = [Step1PersonalInfo, Step2FamilyFinancial, Step3SituationDesc];
const STEP_TITLES    = ['personal.title',  'family.title',  'situation.title'];
const STEP_SUBTITLES = ['personal.subtitle', 'family.subtitle', 'situation.subtitle'];

const FormWizard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentStep, formData } = useSelector((s) => s.form);
  const { language } = useSelector((s) => s.ui);
  const isRTL = language === 'ar';

  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({ defaultValues: formData, mode: 'onBlur' });
  const { handleSubmit, reset, getValues, trigger } = methods;
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      reset(formData);
      prevStepRef.current = currentStep;
    }
  }, [currentStep, formData, reset]);

  const persist = () => {
    dispatch(updateFormData(getValues()));
    dispatch(showSaveIndicator());
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;
    persist();
    dispatch(nextStep());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    persist();
    dispatch(prevStep());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (data) => {
    dispatch(updateFormData(data));
    setSubmitting(true);
    setTimeout(() => {
      dispatch(submitForm());
    }, 1000);
  };

  const StepComponent = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 2, sm: 3 },
        minHeight: 0,
      }}
    >
      {/* ── Spinner — submit only ── */}
      <Fade in={submitting} timeout={180} unmountOnExit>
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.mode === 'dark' ? '#000' : '#fff', 0.35),
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <Box
            sx={{
              width: 88, height: 88,
              borderRadius: '20px',
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(28,28,30,0.88)'
                : 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.50)'
                : '0 8px 32px rgba(0,0,0,0.14)',
            }}
          >
            <AppleSpinner size={38} />
          </Box>
        </Box>
      </Fade>

      {/* ── Stepper (fixed, never scrolls) ── */}
      <Box sx={{ flexShrink: 0 }}>
        <ProgressStepper currentStep={currentStep} />
      </Box>

      {/* ── Card fills remaining height ── */}
      <Fade in key={currentStep} timeout={300} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Card
          elevation={0}
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* ── Step heading (fixed at top of card) ── */}
          <Box
            sx={{
              px: { xs: 2.5, sm: 4 },
              pt: { xs: 2.5, sm: 3 },
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              flexShrink: 0,
            }}
          >
            <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.3 }}>
              {t(STEP_TITLES[currentStep])}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
              {t(STEP_SUBTITLES[currentStep])}
            </Typography>
          </Box>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label={t(STEP_TITLES[currentStep])}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
            >
              {/* ── Scrollable fields ── */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  px: { xs: 2.5, sm: 4 },
                  py: 2.5,
                  '&::-webkit-scrollbar': { width: 5 },
                  '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: 10,
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(0,0,0,0.15)',
                  },
                }}
              >
                <StepComponent />
              </Box>

              {/* ── Navigation (fixed at bottom of card) ── */}
              <Box
                sx={{
                  px: { xs: 2.5, sm: 4 },
                  py: { xs: 2, sm: 2.5 },
                  borderTop: `1px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ visibility: currentStep > 0 ? 'visible' : 'hidden' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleBack}
                    startIcon={isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                    aria-label={t('nav.back')}
                  >
                    {t('nav.back')}
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {isLastStep ? (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      endIcon={submitting ? null : <SendIcon />}
                      aria-label={t('nav.submit')}
                    >
                      {t('nav.submit')}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      size="large"
                      endIcon={isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                      aria-label={t('nav.next')}
                    >
                      {t('nav.next')}
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </FormProvider>
        </Card>
      </Fade>
    </Box>
  );
};

export default FormWizard;
