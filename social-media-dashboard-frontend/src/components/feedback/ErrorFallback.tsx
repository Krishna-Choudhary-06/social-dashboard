import { Box, Button, Typography } from '@mui/material';
import { ReportProblem } from '@mui/icons-material';
import type { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        p: 4,
        textAlign: 'center',
      }}
    >
      <ReportProblem sx={{ fontSize: 64, color: 'error.main', opacity: 0.8 }} />
      <Typography variant="h3">Something went wrong</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </Typography>
      <Button variant="contained" onClick={resetErrorBoundary} size="large">
        Try Again
      </Button>
    </Box>
  );
}
