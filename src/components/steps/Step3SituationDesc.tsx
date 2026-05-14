import { useState } from 'react';
import { Grid, TextField, Box, Typography, Button, Tooltip, Divider } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useSelector } from 'react-redux';
import { generateAISuggestion } from '../../services/openai';
import { generateGroqSuggestion } from '../../services/groq';
import SuggestionDialog from '../AI/SuggestionDialog';
import { numeral } from '../../utils/format';
import { RootState } from '../../store';

interface AITextFieldProps {
  name: string;
  label: string;
  placeholder: string;
  first?: boolean;
}

const AITextField = ({ name, label, placeholder, first }: AITextFieldProps) => {
  const { t, i18n } = useTranslation();
  const { control, setValue, watch, formState: { errors } } = useFormContext();
  const formData = useSelector((s: RootState) => s.form.formData);
  const lang = i18n.language;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [provider, setProvider] = useState('openai');

  const currentValue = watch(name) || '';

  const callAPI = async (serviceFn: typeof generateAISuggestion, providerName: string) => {
    setProvider(providerName);
    setDialogOpen(true);
    setLoading(true);
    setSuggestion('');
    setError('');
    setErrorMessage('');
    try {
      const result = await serviceFn(name, formData, lang);
      setSuggestion(result);
    } catch (err: unknown) {
      const e = err as Record<string, unknown>;
      setError((e?.code as string) || 'API_ERROR');
      setErrorMessage((e?.message as string) || '');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAI = () => callAPI(generateAISuggestion, 'openai');
  const handleGroq = () => callAPI(generateGroqSuggestion, 'groq');
  const handleRetry = () => callAPI(
    provider === 'groq' ? generateGroqSuggestion : generateAISuggestion,
    provider,
  );

  const handleAccept = (text: string) => {
    setValue(name, text, { shouldValidate: true, shouldDirty: true });
    setDialogOpen(false);
    setSuggestion('');
  };

  const handleDiscard = () => {
    setDialogOpen(false);
    setSuggestion('');
    setError('');
    setErrorMessage('');
  };

  return (
    <Box sx={{ mt: first ? 0 : 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          mb: 1,
          flexWrap: 'wrap',
          gap: 0.75,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'primary.main', borderWidth: 2, borderRadius: 1 }} />
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {label}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          <Tooltip title={t('situation.helpMeWriteOpenAI')} placement="top">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<AutoAwesomeIcon sx={{ fontSize: '14px !important' }} />}
              onClick={handleOpenAI}
              aria-label={`${t('situation.helpMeWriteOpenAI')} — ${label}`}
              sx={{
                fontSize: '0.72rem',
                py: 0.35,
                px: 1.2,
                borderRadius: 5,
                lineHeight: 1.4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #3730A3, #6366F1)',
                  color: '#fff',
                  borderColor: 'transparent',
                },
              }}
            >
              {t('situation.helpMeWrite')}
            </Button>
          </Tooltip>

          <Tooltip title={t('situation.helpMeWriteGroq')} placement="top">
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<FlashOnIcon sx={{ fontSize: '14px !important' }} />}
              onClick={handleGroq}
              aria-label={`${t('situation.helpMeWriteGroq')} — ${label}`}
              sx={{
                fontSize: '0.72rem',
                py: 0.35,
                px: 1.2,
                borderRadius: 5,
                lineHeight: 1.4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20, #388E3C)',
                  color: '#fff',
                  borderColor: 'transparent',
                },
              }}
            >
              {t('situation.helpMeWriteGroqLabel')}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Controller
        name={name}
        control={control}
        rules={{
          required: t('validation.required'),
          minLength: { value: 30, message: t('validation.minLength', { min: 30 }) },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            multiline
            minRows={3}
            maxRows={8}
            fullWidth
            placeholder={placeholder}
            error={!!errors[name]}
            helperText={(errors[name]?.message as string) || t('situation.charactersCount', { count: numeral(currentValue.length, lang) })}
            slotProps={{ htmlInput: { 'aria-label': label } }}
          />
        )}
      />

      <SuggestionDialog
        open={dialogOpen}
        loading={loading}
        suggestion={suggestion}
        error={error}
        errorMessage={errorMessage}
        provider={provider}
        onAccept={handleAccept}
        onDiscard={handleDiscard}
        onRetry={handleRetry}
      />
    </Box>
  );
};

const Step3SituationDesc = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={0}>
      <Grid size={12}>
        <AITextField
          name="financialSituation"
          label={t('situation.financialSituation')}
          placeholder={t('situation.financialSituationHelp')}
          first
        />
      </Grid>
      <Grid size={12}>
        <AITextField
          name="employmentCircumstances"
          label={t('situation.employmentCircumstances')}
          placeholder={t('situation.employmentCircumstancesHelp')}
        />
      </Grid>
      <Grid size={12}>
        <AITextField
          name="reasonForApplying"
          label={t('situation.reasonForApplying')}
          placeholder={t('situation.reasonForApplyingHelp')}
        />
      </Grid>
    </Grid>
  );
};

export default Step3SituationDesc;
