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
import Spinner from '../common/Spinner';
import { RootState } from '../../store';
import { FormData } from '../../types';

const STEPS: React.ComponentType[] = [Step1PersonalInfo, Step2FamilyFinancial, Step3SituationDesc];
const STEP_TITLES = ['personal.title', 'family.title', 'situation.title'];
const STEP_SUBTITLES = ['personal.subtitle', 'family.subtitle', 'situation.subtitle'];

const FormWizard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentStep, formData } = useSelector((s: RootState) => s.form);
  const { language } = useSelector((s: RootState) => s.ui);
  const isRTL = language === 'ar';

  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({ defaultValues: formData, mode: 'onBlur' });
  const { handleSubmit, reset, getValues, trigger, clearErrors } = methods;
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      reset(formData);
      prevStepRef.current = currentStep;
    }
  }, [currentStep, formData, reset]);

  useEffect(() => {
    clearErrors();
  }, [language, clearErrors]);

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

  const onSubmit = (data: FormData) => {
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
        height: { sm: '100%' },
        display: 'flex',
        flexDirection: 'column',
        minHeight: { sm: 0 },
      }}
    >
      {/* Submit overlay */}
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
            <Spinner size={38} />
          </Box>
        </Box>
      </Fade>

      <Box sx={{ flexShrink: 0 }}>
        <ProgressStepper currentStep={currentStep} />
      </Box>

      {/* Remove flex/minHeight from Fade style — put on Card sx so breakpoints work */}
      <Fade in key={currentStep} timeout={300}>
        <Card
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: { sm: 1 },
            minHeight: { sm: 0 },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
          }}
        >
          {/* Step header */}
          <Box
            sx={{
              px: { xs: 2, sm: 4 },
              pt: { xs: 1.5, sm: 3 },
              pb: { xs: 1.25, sm: 2 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: { xs: '1rem', sm: '1.5rem' } }}
            >
              {t(STEP_TITLES[currentStep])}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.4, lineHeight: 1.6, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t(STEP_SUBTITLES[currentStep])}
            </Typography>
          </Box>

          <FormProvider {...methods}>
            {/* Convert form to Box so sx breakpoints work */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label={t(STEP_TITLES[currentStep])}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: { sm: 1 },
                minHeight: { sm: 0 },
                overflow: { sm: 'hidden' },
              }}
            >
              {/* Scrollable content — desktop: internal scroll; mobile: page scroll */}
              <Box
                sx={{
                  flex: { sm: 1 },
                  overflowY: { sm: 'auto' },
                  overflowX: 'hidden',
                  px: { xs: 2, sm: 4 },
                  pt: { xs: 1.5, sm: 2.5 },
                  /* Reserve space on mobile for the fixed footer */
                  pb: { xs: 10, sm: 2.5 },
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

              {/* Footer nav — fixed to viewport bottom on mobile, static on desktop */}
              <Box
                sx={{
                  px: { xs: 2, sm: 4 },
                  py: { xs: 1.25, sm: 2 },
                  borderTop: `1px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  bgcolor: 'background.paper',
                  /* Pin to bottom of viewport on mobile */
                  position: { xs: 'fixed', sm: 'static' },
                  bottom: { xs: 0, sm: 'auto' },
                  left: { xs: 0, sm: 'auto' },
                  right: { xs: 0, sm: 'auto' },
                  zIndex: { xs: 100, sm: 'auto' },
                }}
              >
                <Box sx={{ visibility: currentStep > 0 ? 'visible' : 'hidden' }}>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleBack}
                    startIcon={isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                    aria-label={t('nav.back')}
                  >
                    {t('nav.back')}
                  </Button>
                </Box>

                <Box>
                  {isLastStep ? (
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
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
                      size="medium"
                      endIcon={isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                      aria-label={t('nav.next')}
                    >
                      {t('nav.next')}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </FormProvider>
        </Card>
      </Fade>
    </Box>
  );
};

export default FormWizard;
