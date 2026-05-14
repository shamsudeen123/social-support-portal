import React from 'react';
import { Grid, TextField, MenuItem, Typography, Box, Divider } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  first?: boolean;
}

const SectionHeader = ({ icon: Icon, title, first }: SectionHeaderProps) => (
  <Box
    sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      mt: first ? 0 : { xs: 2, sm: 3 },
      mb: { xs: 1.5, sm: 2 },
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
    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
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

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
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
                helperText={errors.fullName?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.fullName'), autoComplete: 'name' } }}
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
                helperText={errors.nationalId?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.nationalId') } }}
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
              <DatePicker
                label={t('personal.dateOfBirth')}
                value={field.value ? dayjs(field.value) : null}
                onChange={(val) => field.onChange(val ? val.format('YYYY-MM-DD') : '')}
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth?.message as string,
                    onBlur: field.onBlur,
                    slotProps: { htmlInput: { 'aria-label': t('personal.dateOfBirth') } },
                  },
                  popper: {
                    placement: 'bottom-start',
                    modifiers: [
                      { name: 'flip', enabled: true },
                      { name: 'preventOverflow', enabled: true, options: { boundary: 'viewport', altAxis: true } },
                      { name: 'offset', options: { offset: [0, 4] } },
                    ],
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
                helperText={errors.gender?.message as string}
                slotProps={{
                  htmlInput: { 'aria-label': t('personal.gender') },
                  select: { renderValue: (val: unknown) => genderOptions.find(o => o.value === val)?.label ?? String(val) },
                }}
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

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
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
                helperText={errors.address?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.address'), autoComplete: 'street-address' } }}
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
                helperText={errors.city?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.city'), autoComplete: 'address-level2' } }}
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
                helperText={errors.state?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.state'), autoComplete: 'address-level1' } }}
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
                helperText={errors.country?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.country'), autoComplete: 'country-name' } }}
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
                helperText={errors.phone?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.phone'), autoComplete: 'tel' } }}
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
                helperText={errors.email?.message as string}
                slotProps={{ htmlInput: { 'aria-label': t('personal.email'), autoComplete: 'email' } }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step1PersonalInfo;
