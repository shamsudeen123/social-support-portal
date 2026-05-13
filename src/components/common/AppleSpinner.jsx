import React from 'react';
import { Box } from '@mui/material';
import { useTheme, keyframes } from '@mui/material/styles';

const fade = keyframes`
  0%   { opacity: 1;   }
  100% { opacity: 0.1; }
`;

/**
 * Standard iOS UIActivityIndicatorView — 12 radial bars fading in sequence.
 *
 * Bar geometry (scales with `size`):
 *   width  8 %,  left  46 %   → horizontal centre at 50 %
 *   height 18 %, top   32 %   → bottom edge at 50 % (= container centre)
 *   transformOrigin '50% 100%' → rotation pivot at bar's bottom = container centre
 *
 * Each bar has a staggered animationDelay so the bright position
 * rotates clockwise — matching the native iOS indicator exactly.
 */
const AppleSpinner = ({ size = 40 }) => {
  const theme = useTheme();
  const color = theme.palette.mode === 'dark'
    ? 'rgba(235,235,245,0.90)'
    : 'rgba(60,60,67,0.85)';

  return (
    <Box
      role="progressbar"
      aria-label="Loading"
      sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '8%',
            height: '18%',
            left: '46%',
            top: '32%',
            borderRadius: '50px',
            bgcolor: color,
            transformOrigin: '50% 100%',
            transform: `rotate(${i * 30}deg)`,
            animation: `${fade} 1s linear infinite`,
            animationDelay: `-${((12 - i) / 12).toFixed(3)}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default AppleSpinner;
