import { Outlet } from 'react-router';
import { Box } from '@mui/material';

// ============================================================
// Auth Layout — Centered card, no sidebar
// ============================================================

export function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 30% 40%, rgba(128, 131, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(170, 2, 102, 0.06) 0%, transparent 50%)'
              : 'radial-gradient(circle at 30% 40%, rgba(73, 75, 214, 0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, px: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
