import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Cell,
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { tokens } from '@/app/theme';

interface BarChartWidgetProps {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  categoryKey?: string;
  colors?: string[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <Paper
      sx={{
        p: 1.5,
        bgcolor: tokens.colors.surfaceContainerHighest,
        border: `1px solid ${tokens.colors.outlineVariant}`,
        borderRadius: 1.5,
      }}
    >
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      {payload.map((entry: any, i: number) => (
        <Typography key={i} variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
          {entry.value?.toLocaleString()}
        </Typography>
      ))}
    </Paper>
  );
}

const defaultColors = [
  tokens.colors.primary,
  tokens.colors.secondary,
  tokens.colors.tertiary,
  tokens.colors.facebook,
  tokens.colors.instagram,
  tokens.colors.youtube,
];

export function BarChartWidget({
  data,
  dataKey,
  categoryKey = 'name',
  colors = defaultColors,
  height = 300,
  layout = 'vertical',
}: BarChartWidgetProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 8, left: layout === 'vertical' ? 60 : -16, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}
          horizontal={layout === 'vertical'}
          vertical={layout !== 'vertical'}
        />

        {layout === 'vertical' ? (
          <>
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11 }} />
            <YAxis type="category" dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11 }} width={80} />
          </>
        ) : (
          <>
            <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: tokens.colors.onSurfaceVariant, fontSize: 11 }} />
          </>
        )}

        <RTooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />

        <Bar dataKey={dataKey} radius={[4, 4, 4, 4]} barSize={layout === 'vertical' ? 20 : 32}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
