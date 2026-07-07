import { Box, Typography, Breadcrumbs, Link, type SxProps, type Theme } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  sx?: SxProps<Theme>;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, sx }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext sx={{ fontSize: 16 }} />}
          sx={{ mb: 1, '& .MuiBreadcrumbs-li': { fontSize: '0.75rem' } }}
        >
          {breadcrumbs.map((crumb, i) =>
            crumb.href ? (
              <Link
                key={i}
                href={crumb.href}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={i} color="text.primary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h2" component="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}
