import { Skeleton, Card, CardContent, Box, Grid, type SxProps, type Theme } from '@mui/material';
import { tokens } from '@/app/theme';

interface SkeletonProps {
  sx?: SxProps<Theme>;
}

export function CardSkeleton({ sx }: SkeletonProps) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton variant="text" width={140} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={80} height={20} />
      </CardContent>
    </Card>
  );
}

export function KpiGridSkeleton() {
  return (
    <Grid container spacing={2}>
      {[...Array(4)].map((_, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export function ChartSkeleton({ sx }: SkeletonProps) {
  return (
    <Card sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Skeleton variant="text" width={140} height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={200} height={16} />
          </Box>
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Skeleton
          variant="rectangular"
          height={240}
          sx={{ borderRadius: 1 }}
        />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Skeleton variant="rectangular" width={240} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} variant="text" height={24} sx={{ flex: 1 }} />
        ))}
      </Box>
      {[...Array(rows)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} variant="text" height={40} sx={{ flex: 1 }} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
