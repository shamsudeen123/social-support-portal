import {
  Grid, TextField, MenuItem, Box, Typography, Divider, InputAdornment,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';

const SectionHeader = ({ icon: Icon, title, first }) => (
  <Box
    sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      mt: first ? 0 : 2,
      mb: 1.5,
    }}
  >
    <Box
      sx={{
        width: 28, height: 28, borderRadius: 1.5,
        bgcolor: 'secondary.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color: '#fff', fontSize: 15 }} />
    </Box>
    <Typography variant="overline" fontWeight={700} color="text.secondary" letterSpacing={0.8}>
      {title}
    </Typography>
    <Divider sx={{ flex: 1 }} />
  </Box>
);

const Step2FamilyFinancial = () => {
  const { t } = useTranslation();
  const { control, formState: { errors } } = useFormContext();

  const maritalOptions = [
    { value: 'single',   label: t('family.single') },
    { value: 'married',  label: t('family.married') },
    { value: 'divorced', label: t('family.divorced') },
    { value: 'widowed',  label: t('family.widowed') },
  ];

  const employmentOptions = [
    { value: 'employed',      label: t('family.employed') },
    { value: 'unemployed',    label: t('family.unemployed') },
    { value: 'self_employed', label: t('family.selfEmployed') },
    { value: 'student',       label: t('family.student') },
    { value: 'retired',       label: t('family.retired') },
    { value: 'unable',        label: t('family.unable') },
  ];

  const housingOptions = [
    { value: 'owned',              label: t('family.owned') },
    { value: 'rented',             label: t('family.rented') },
    { value: 'living_with_family', label: t('family.livingWithFamily') },
    { value: 'homeless',           label: t('family.homeless') },
    { value: 'other',              label: t('family.other') },
  ];

  return (
    <Box>
      <SectionHeader icon={FamilyRestroomIcon} title={t('family.familySection')} first />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="maritalStatus"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('family.maritalStatus')}
                fullWidth
                error={!!errors.maritalStatus}
                helperText={errors.maritalStatus?.message}
                inputProps={{ 'aria-label': t('family.maritalStatus') }}
                SelectProps={{ renderValue: (val) => maritalOptions.find(o => o.value === val)?.label ?? val }}
              >
                {maritalOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="dependents"
            control={control}
            rules={{
              required: t('validation.required'),
              min: { value: 0, message: t('validation.minValue', { min: 0 }) },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('family.dependents')}
                type="number"
                fullWidth
                error={!!errors.dependents}
                helperText={errors.dependents?.message || t('family.dependentsHelp')}
                inputProps={{ min: 0, max: 20, 'aria-label': t('family.dependents') }}
              />
            )}
          />
        </Grid>
      </Grid>

      <SectionHeader icon={AccountBalanceWalletOutlinedIcon} title={t('family.employmentSection')} />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="employmentStatus"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('family.employmentStatus')}
                fullWidth
                error={!!errors.employmentStatus}
                helperText={errors.employmentStatus?.message}
                inputProps={{ 'aria-label': t('family.employmentStatus') }}
                SelectProps={{ renderValue: (val) => employmentOptions.find(o => o.value === val)?.label ?? val }}
              >
                {employmentOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="monthlyIncome"
            control={control}
            rules={{
              required: t('validation.required'),
              min: { value: 0, message: t('validation.minValue', { min: 0 }) },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('family.monthlyIncome')}
                type="number"
                fullWidth
                placeholder={t('family.monthlyIncomePlaceholder')}
                error={!!errors.monthlyIncome}
                helperText={errors.monthlyIncome?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                }}
                inputProps={{ min: 0, step: '0.01', 'aria-label': t('family.monthlyIncome') }}
              />
            )}
          />
        </Grid>
      </Grid>

      <SectionHeader icon={HomeWorkOutlinedIcon} title={t('family.housingSection')} />

      <Grid container spacing={1.5}>
        <Grid size={12}>
          <Controller
            name="housingStatus"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('family.housingStatus')}
                fullWidth
                error={!!errors.housingStatus}
                helperText={errors.housingStatus?.message}
                inputProps={{ 'aria-label': t('family.housingStatus') }}
                SelectProps={{ renderValue: (val) => housingOptions.find(o => o.value === val)?.label ?? val }}
              >
                {housingOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2FamilyFinancial;
