import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { tokens } from '@/app/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function StatCard({ label, value, change, changeLabel, trend = 'neutral', icon }: StatCardProps) {
  const trendColor =
    trend === 'up' ? tokens.colors.success : trend === 'down' ? tokens.colors.error : tokens.colors.onSurfaceVariant;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : TrendingFlat;

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: trend === 'up'
            ? `linear-gradient(90deg, ${tokens.colors.success}, transparent)`
            : trend === 'down'
            ? `linear-gradient(90deg, ${tokens.colors.error}, transparent)`
            : 'transparent',
          opacity: 0.6,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}
          >
            {label}
          </Typography>
          {icon && (
            <Box sx={{ color: 'text.secondary', opacity: 0.5 }}>{icon}</Box>
          )}
        </Box>

        <Typography
          variant="h3"
          sx={{
            mt: 1,
            fontFamily: tokens.typography.fontFamily.headline,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>

        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <Chip
              icon={<TrendIcon sx={{ fontSize: '14px !important' }} />}
              label={`${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
              size="small"
              sx={{
                height: 22,
                bgcolor: `${trendColor}18`,
                color: trendColor,
                fontFamily: tokens.typography.fontFamily.mono,
                fontSize: '0.6875rem',
                fontWeight: 600,
                '& .MuiChip-icon': { color: trendColor },
              }}
            />
            {changeLabel && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                {changeLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
