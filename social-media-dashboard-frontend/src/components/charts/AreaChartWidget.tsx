import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { tokens } from '@/app/theme';

interface AreaChartWidgetProps {
  data: Array<Record<string, unknown>>;
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <Paper
      sx={{
        p: 1.5,
        bgcolor: tokens.colors.surfaceContainerHighest,
        border: `1px solid ${tokens.colors.outlineVariant}`,
        backdropFilter: 'blur(12px)',
        borderRadius: 1.5,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: tokens.typography.fontFamily.mono }}>
        {label}
      </Typography>
      {payload.map((entry: any, i: number) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
          <Typography variant="body2" fontWeight={600}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

export function AreaChartWidget({
  data,
  dataKeys,
  xAxisKey = 'date',
  height = 320,
  showGrid = true,
  showLegend = false,
}: AreaChartWidgetProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient key={dk.key} id={`gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dk.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}
            vertical={false}
          />
        )}

        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11, fontFamily: tokens.typography.fontFamily.mono }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11, fontFamily: tokens.typography.fontFamily.mono }}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
        />

        <RTooltip content={<CustomTooltip />} cursor={{ stroke: tokens.colors.primary, strokeWidth: 1, strokeDasharray: '4 4' }} />

        {showLegend && <Legend wrapperStyle={{ fontSize: 12, fontFamily: tokens.typography.fontFamily.mono }} />}

        {dataKeys.map((dk) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            name={dk.name}
            stroke={dk.color}
            strokeWidth={2}
            fill={`url(#gradient-${dk.key})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, fill: isDark ? tokens.colors.surface : '#fff' }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
