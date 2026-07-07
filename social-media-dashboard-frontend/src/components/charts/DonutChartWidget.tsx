import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  Legend,
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { tokens } from '@/app/theme';

interface DonutChartWidgetProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string;
}

const defaultColors = [
  tokens.colors.primary,
  tokens.colors.secondary,
  tokens.colors.tertiary,
  tokens.colors.facebook,
  tokens.colors.instagram,
  '#FF6B6B',
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const { name, value } = payload[0];

  return (
    <Paper sx={{ p: 1.5, bgcolor: tokens.colors.surfaceContainerHighest, border: `1px solid ${tokens.colors.outlineVariant}`, borderRadius: 1.5 }}>
      <Typography variant="body2" fontWeight={600}>{name}: {value.toLocaleString()}</Typography>
    </Paper>
  );
}

export function DonutChartWidget({
  data,
  height = 280,
  innerRadius = 65,
  outerRadius = 95,
  showLegend = true,
  centerLabel,
  centerValue,
}: DonutChartWidgetProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || defaultColors[i % defaultColors.length]} />
            ))}
          </Pie>
          <RTooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              formatter={(value: string) => (
                <span style={{ color: tokens.colors.onSurfaceVariant, fontSize: 12 }}>{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {centerLabel && centerValue && (
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight={700}>{centerValue}</Typography>
          <Typography variant="caption" color="text.secondary">{centerLabel}</Typography>
        </Box>
      )}
    </Box>
  );
}
