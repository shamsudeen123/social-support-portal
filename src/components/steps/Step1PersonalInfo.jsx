import { Grid, TextField, MenuItem, Typography, Box, Divider } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

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
        bgcolor: 'primary.main',
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

const Step1PersonalInfo = () => {
  const { t } = useTranslation();
  const { control, formState: { errors } } = useFormContext();

  const genderOptions = [
    { value: 'male',       label: t('personal.male') },
    { value: 'female',     label: t('personal.female') },
    { value: 'other',      label: t('personal.other') },
    { value: 'prefer_not', label: t('personal.preferNotToSay') },
  ];

  return (
    <Box>
      <SectionHeader icon={PersonOutlinedIcon} title={t('personal.title')} first />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: t('validation.required'),
              minLength: { value: 2, message: t('validation.minLength', { min: 2 }) },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.fullName')}
                placeholder={t('personal.placeholders.fullName')}
                fullWidth
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                inputProps={{ 'aria-label': t('personal.fullName'), autoComplete: 'name' }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="nationalId"
            control={control}
            rules={{
              required: t('validation.required'),
              minLength: { value: 5, message: t('validation.nationalIdMin') },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.nationalId')}
                placeholder={t('personal.placeholders.nationalId')}
                fullWidth
                error={!!errors.nationalId}
                helperText={errors.nationalId?.message}
                inputProps={{ 'aria-label': t('personal.nationalId') }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.dateOfBirth')}
                type="date"
                fullWidth
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    'aria-label': t('personal.dateOfBirth'),
                    max: new Date().toISOString().split('T')[0],
                    dir: 'ltr',
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t('personal.gender')}
                fullWidth
                error={!!errors.gender}
                helperText={errors.gender?.message}
                inputProps={{ 'aria-label': t('personal.gender') }}
                SelectProps={{ renderValue: (val) => genderOptions.find(o => o.value === val)?.label ?? val }}
              >
                {genderOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <SectionHeader icon={HomeOutlinedIcon} title={t('personal.addressSection')} />

      <Grid container spacing={1.5}>
        <Grid size={12}>
          <Controller
            name="address"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.address')}
                placeholder={t('personal.placeholders.address')}
                fullWidth
                error={!!errors.address}
                helperText={errors.address?.message}
                inputProps={{ 'aria-label': t('personal.address'), autoComplete: 'street-address' }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="city"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.city')}
                placeholder={t('personal.placeholders.city')}
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
                inputProps={{ 'aria-label': t('personal.city'), autoComplete: 'address-level2' }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="state"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.state')}
                placeholder={t('personal.placeholders.state')}
                fullWidth
                error={!!errors.state}
                helperText={errors.state?.message}
                inputProps={{ 'aria-label': t('personal.state'), autoComplete: 'address-level1' }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="country"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.country')}
                placeholder={t('personal.placeholders.country')}
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message}
                inputProps={{ 'aria-label': t('personal.country'), autoComplete: 'country-name' }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: t('validation.required'),
              pattern: { value: /^[+\d\s\-()]{7,20}$/, message: t('validation.phoneInvalid') },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.phone')}
                placeholder={t('personal.placeholders.phone')}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                inputProps={{ 'aria-label': t('personal.phone'), autoComplete: 'tel' }}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: t('validation.required'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('validation.emailInvalid'),
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('personal.email')}
                placeholder={t('personal.placeholders.email')}
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                inputProps={{ 'aria-label': t('personal.email'), autoComplete: 'email' }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step1PersonalInfo;
