import { Card, CardContent, Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface GlassCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  sx?: SxProps<Theme>;
  noPadding?: boolean;
}

export function GlassCard({ title, subtitle, children, actions, sx, noPadding }: GlassCardProps) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      {(title || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pt: 2.5,
            pb: subtitle ? 0.5 : 2,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h5" fontWeight={600}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Box>
      )}
      <CardContent sx={{ p: noPadding ? '0 !important' : 3, pt: title ? '16px !important' : undefined }}>
        {children}
      </CardContent>
    </Card>
  );
}
