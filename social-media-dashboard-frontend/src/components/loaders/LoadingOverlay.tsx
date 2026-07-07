import { Box, CircularProgress, Typography, type SxProps, type Theme } from '@mui/material';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  sx?: SxProps<Theme>;
}

export function LoadingOverlay({ message = 'Loading...', fullScreen = false, sx }: LoadingOverlayProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen
          ? { position: 'fixed', inset: 0, zIndex: 9999, bgcolor: 'background.default' }
          : { py: 8 }),
        ...sx,
      }}
    >
      <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
