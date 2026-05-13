import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Paper, Chip, Divider, Grid, CircularProgress,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useSelector, useDispatch } from 'react-redux';
import { resetForm } from '../slices/formSlice';
import { useTranslation } from 'react-i18next';
import { numeral } from '../utils/format';
import { translateToArabic } from '../services/groq';

/* ── Sub-components ── */
const SectionHeader = ({ icon: Icon, title, color, lang }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
    <Box sx={{
      width: 24, height: 24, borderRadius: 1,
      bgcolor: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon sx={{ color: '#fff', fontSize: 13 }} />
    </Box>
    <Typography variant="overline" fontWeight={700} color="text.secondary" sx={{
      letterSpacing: lang === 'ar' ? 0 : 0.8,
      lineHeight: 1,
      textTransform: lang === 'ar' ? 'none' : undefined,
    }}>
      {title}
    </Typography>
  </Box>
);

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5, py: 0.6 }}>
    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ textAlign: 'end', wordBreak: 'break-word' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const SituationCard = ({ label, value, color, isDark, lang, loading }) => {
  return (
    <Box sx={{
      p: 1.75,
      borderRadius: '10px',
      height: '100%',
      bgcolor: isDark ? alpha('#fff', 0.03) : alpha(color, 0.04),
      border: `1px solid ${alpha(color, 0.18)}`,
      borderTop: `3px solid ${color}`,
    }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.75, letterSpacing: lang === 'ar' ? 0 : 0.3 }}>
        {label}
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
          <CircularProgress size={16} thickness={5} sx={{ color }} />
        </Box>
      ) : (
        <Typography variant="caption" color="text.primary" sx={{
          display: '-webkit-box', WebkitLineClamp: 5,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          lineHeight: 1.7, fontSize: '0.72rem',
        }}>
          {value || '—'}
        </Typography>
      )}
    </Box>
  );
};

/* ── Page ── */
const SuccessPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { referenceNumber, formData } = useSelector((s) => s.form);
  const isDark = theme.palette.mode === 'dark';
  const lang = i18n.language;
  const n = (num) => numeral(num, lang);

  const [arContent, setArContent] = useState(null);
  const [translating, setTranslating] = useState(false);
  const didTranslate = useRef(false);

  useEffect(() => {
    if (lang !== 'ar') {
      setArContent(null);
      didTranslate.current = false;
      return;
    }
    if (didTranslate.current) return;
    didTranslate.current = true;

    const addr = [formData.address, formData.city, formData.state, formData.country].filter(Boolean).join(', ');
    const keys = ['financialSituation', 'employmentCircumstances', 'reasonForApplying', 'fullName', 'fullAddress'];
    const values = [
      formData.financialSituation,
      formData.employmentCircumstances,
      formData.reasonForApplying,
      formData.fullName,
      addr,
    ];

    setTranslating(true);
    Promise.all(values.map(txt => txt?.trim() ? translateToArabic(txt) : Promise.resolve(txt || '')))
      .then(translated => {
        const result = {};
        keys.forEach((k, i) => { result[k] = translated[i]; });
        setArContent(result);
        setTranslating(false);
      })
      .catch(() => {
        didTranslate.current = false;
        setTranslating(false);
      });
  }, [lang, formData.financialSituation, formData.employmentCircumstances, formData.reasonForApplying,
      formData.fullName, formData.address, formData.city, formData.state, formData.country]);

  const displayRef = referenceNumber && lang === 'ar'
    ? referenceNumber.replace(/\d+/, (d) => Number(d).toLocaleString('ar-EG'))
    : referenceNumber;

  const formatDate = (str) => {
    if (!str) return '—';
    const [y, m, d] = str.split('-');
    return lang === 'ar' ? `${n(+d)}/${n(+m)}/${n(+y)}` : `${d}/${m}/${y}`;
  };

  const genderMap     = { male: t('personal.male'), female: t('personal.female'), other: t('personal.other'), prefer_not: t('personal.preferNotToSay') };
  const maritalMap    = { single: t('family.single'), married: t('family.married'), divorced: t('family.divorced'), widowed: t('family.widowed') };
  const employmentMap = { employed: t('family.employed'), unemployed: t('family.unemployed'), self_employed: t('family.selfEmployed'), student: t('family.student'), retired: t('family.retired'), unable: t('family.unable') };
  const housingMap    = { owned: t('family.owned'), rented: t('family.rented'), living_with_family: t('family.livingWithFamily'), homeless: t('family.homeless'), other: t('family.other') };

  const fullAddress = [formData.address, formData.city, formData.state, formData.country].filter(Boolean).join(', ');

  return (
    <Box sx={{
      flex: 1, overflowY: 'auto',
      px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 },
      '&::-webkit-scrollbar': { width: 5 },
      '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 10,
        bgcolor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)',
      },
    }}>
      <Paper elevation={0} sx={{
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '20px',
        overflow: 'hidden',
        '&::before': {
          content: '""', display: 'block', height: 4,
          background: 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)',
        },
      }}>

        {/* ── Success header ── */}
        <Box sx={{ px: { xs: 3, sm: 4 }, pt: { xs: 3, sm: 3.5 }, pb: 2.5, textAlign: 'center' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.main',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: [
                `0 0 0  5px ${alpha(theme.palette.success.main, 0.14)}`,
                `0 0 0 11px ${alpha(theme.palette.success.main, 0.07)}`,
              ].join(', '),
            }}>
              <CheckCircleIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
          </Box>
          <Typography variant="h6" fontWeight={800} color="success.main" gutterBottom>
            {t('submit.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.65} sx={{ mb: 2.5 }}>
            {t('submit.subtitle')}
          </Typography>

          {/* Reference card */}
          <Box sx={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.10) : alpha(theme.palette.primary.main, 0.06),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            borderRadius: '12px', px: 4, py: 1.75,
          }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary"
              textTransform={lang === 'ar' ? 'none' : 'uppercase'}
              letterSpacing={lang === 'ar' ? 0 : 1.2}>
              {t('submit.referenceNumber')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <TagIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={800} color="primary.main" letterSpacing={lang === 'ar' ? 0 : 1.5}>
                {displayRef}
              </Typography>
            </Box>
            <Chip label={t('submit.applicationReceived')} color="success" size="small" sx={{ fontWeight: 700, borderRadius: '6px', mt: 1 }} />
          </Box>
        </Box>

        {/* ── Summary divider ── */}
        <Divider sx={{ mx: { xs: 3, sm: 4 } }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: lang === 'ar' ? 0 : 0.5 }}>
            {t('submit.applicationSummary')}
          </Typography>
        </Divider>

        {/* ── Detail sections ── */}
        <Box sx={{ px: { xs: 3, sm: 4 }, pt: 2.5, pb: 2 }}>
          <Grid container spacing={2.5}>

            {/* Personal Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionHeader icon={PersonOutlinedIcon} title={t('personal.title')} color={theme.palette.primary.main} lang={lang} />
              <Box sx={{
                bgcolor: isDark ? alpha('#fff', 0.03) : alpha(theme.palette.primary.main, 0.03),
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '10px', px: 2, py: 1.25,
              }}>
                <DetailRow label={t('personal.fullName')}       value={arContent !== null ? arContent.fullName   : formData.fullName} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('personal.nationalId')}     value={lang === 'ar' && formData.nationalId ? formData.nationalId.replace(/\d/g, d => Number(d).toLocaleString('ar-EG')) : formData.nationalId} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('personal.dateOfBirth')}    value={formatDate(formData.dateOfBirth)} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('personal.gender')}         value={genderMap[formData.gender] || formData.gender} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('personal.phone')}          value={lang === 'ar' && formData.phone ? formData.phone.replace(/\d/g, d => Number(d).toLocaleString('ar-EG')) : formData.phone} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('personal.email')}          value={lang === 'ar' && formData.email ? formData.email.replace(/\d/g, d => Number(d).toLocaleString('ar-EG')) : formData.email} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('personal.addressSection')} value={arContent !== null ? arContent.fullAddress : fullAddress} />
              </Box>
            </Grid>

            {/* Family & Financial */}
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionHeader icon={FamilyRestroomIcon} title={t('family.title')} color={theme.palette.secondary.main} lang={lang} />
              <Box sx={{
                bgcolor: isDark ? alpha('#fff', 0.03) : alpha(theme.palette.secondary.main, 0.03),
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '10px', px: 2, py: 1.25,
              }}>
                <DetailRow label={t('family.maritalStatus')}    value={maritalMap[formData.maritalStatus] || formData.maritalStatus} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('family.dependents')}       value={n(formData.dependents)} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('family.employmentStatus')} value={employmentMap[formData.employmentStatus] || formData.employmentStatus} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('family.monthlyIncome')}    value={formData.monthlyIncome ? `${lang === 'ar' ? 'د.إ' : 'AED'} ${n(formData.monthlyIncome)}` : '—'} />
                <Divider sx={{ my: 0.25 }} />
                <DetailRow label={t('family.housingStatus')}    value={housingMap[formData.housingStatus] || formData.housingStatus} />
              </Box>
            </Grid>

            {/* Situation — 3 equal cards */}
            <Grid size={12}>
              <SectionHeader icon={DescriptionOutlinedIcon} title={t('situation.title')} color={theme.palette.success.main} lang={lang} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SituationCard
                    label={t('situation.financialSituation')}
                    value={arContent !== null ? arContent.financialSituation : formData.financialSituation}
                    color={theme.palette.success.main}
                    isDark={isDark}
                    lang={lang}
                    loading={translating}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SituationCard
                    label={t('situation.employmentCircumstances')}
                    value={arContent !== null ? arContent.employmentCircumstances : formData.employmentCircumstances}
                    color={theme.palette.primary.main}
                    isDark={isDark}
                    lang={lang}
                    loading={translating}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SituationCard
                    label={t('situation.reasonForApplying')}
                    value={arContent !== null ? arContent.reasonForApplying : formData.reasonForApplying}
                    color={theme.palette.secondary.main}
                    isDark={isDark}
                    lang={lang}
                    loading={translating}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* ── Processing notice + CTA ── */}
        <Box sx={{ px: { xs: 3, sm: 4 }, pb: { xs: 3, sm: 3.5 }, pt: 1 }}>
          <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1.25,
            bgcolor: isDark ? alpha('#fff', 0.04) : alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px', px: 2, py: 1.5, mb: 2.5,
          }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.disabled', mt: 0.3, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.65}>
              {t('submit.message')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(resetForm())}
            aria-label={t('submit.newApplication')}
          >
            {t('submit.newApplication')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SuccessPage;
