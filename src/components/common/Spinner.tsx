import { Box } from '@mui/material';
import { useTheme, keyframes } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const OPACITIES = [1, 0.85, 0.72, 0.60, 0.50, 0.42, 0.34, 0.28, 0.22, 0.18, 0.14, 0.10];

interface Props {
  size?: number;
}

const Spinner = ({ size = 40 }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const color = theme.palette.mode === 'dark'
    ? 'rgba(235,235,245,0.92)'
    : 'rgba(60,60,67,0.88)';

  return (
    <Box
      role="progressbar"
      aria-label={t('aria.loading')}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        animation: `${spin} 1s steps(12, end) infinite`,
      }}
    >
      {OPACITIES.map((opacity, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '8%',
            height: '25%',
            left: '46%',
            top: '25%',
            borderRadius: '50px',
            bgcolor: color,
            opacity,
            transformOrigin: '50% 100%',
            transform: `rotate(${i * 30}deg)`,
          }}
        />
      ))}
    </Box>
  );
};

export default Spinner;
