import { useEffect } from 'react';
import { Fade, Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { hideSaveIndicator } from '../../slices/uiSlice';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';

const SaveIndicator = () => {
  const { saveIndicator } = useSelector((s: RootState) => s.ui);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (saveIndicator) {
      const timer = setTimeout(() => dispatch(hideSaveIndicator()), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveIndicator, dispatch]);

  return (
    <Fade in={saveIndicator} timeout={300}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main', minHeight: 24 }}
        aria-live="polite"
      >
        <CheckCircleOutlineIcon fontSize="small" />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {t('nav.saveProgress')}
        </Typography>
      </Box>
    </Fade>
  );
};

export default SaveIndicator;
