import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';

// ============================================================
// MUI Theme — Stitch "Lumina Analytics" Design System
// ============================================================

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => {
  const isDark = mode === 'dark';
  const c = isDark ? tokens.colors : { ...tokens.colors, ...tokens.lightColors };

  return {
    palette: {
      mode,
      primary: {
        main: c.primary,
        dark: isDark ? '#8083ff' : '#2f2ebe',
        light: isDark ? '#e1e0ff' : '#c0c1ff',
        contrastText: c.onPrimary,
      },
      secondary: {
        main: c.secondary,
        dark: isDark ? '#aa0266' : '#8c0053',
        light: isDark ? '#ffd9e4' : '#ffb0cd',
        contrastText: c.onSecondary,
      },
      error: {
        main: c.error,
        contrastText: c.onError,
      },
      warning: {
        main: tokens.colors.warning,
      },
      success: {
        main: tokens.colors.success,
      },
      info: {
        main: c.tertiary || tokens.colors.tertiary,
        contrastText: c.onTertiary || tokens.colors.onTertiary,
      },
      background: {
        default: c.surface,
        paper: isDark ? tokens.colors.surfaceContainer : c.surfaceContainer || '#f2ecf8',
      },
      text: {
        primary: c.onSurface,
        secondary: c.onSurfaceVariant,
      },
      divider: c.outlineVariant,
      action: {
        hover: isDark ? 'rgba(192, 193, 255, 0.08)' : 'rgba(73, 75, 214, 0.08)',
        selected: isDark ? 'rgba(192, 193, 255, 0.12)' : 'rgba(73, 75, 214, 0.12)',
        focus: isDark ? 'rgba(192, 193, 255, 0.12)' : 'rgba(73, 75, 214, 0.12)',
      },
    },

    typography: {
      fontFamily: tokens.typography.fontFamily.body,
      h1: {
        fontFamily: tokens.typography.fontFamily.headline,
        ...tokens.typography.displayLg,
      },
      h2: {
        fontFamily: tokens.typography.fontFamily.headline,
        ...tokens.typography.headlineLg,
      },
      h3: {
        fontFamily: tokens.typography.fontFamily.headline,
        ...tokens.typography.headlineMd,
      },
      h4: {
        fontFamily: tokens.typography.fontFamily.headline,
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: '1.75rem',
      },
      h5: {
        fontFamily: tokens.typography.fontFamily.headline,
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
      },
      h6: {
        fontFamily: tokens.typography.fontFamily.headline,
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: '1.375rem',
      },
      body1: tokens.typography.bodyMd,
      body2: tokens.typography.bodySm,
      subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: '1.25rem',
        letterSpacing: '0.01em',
      },
      subtitle2: {
        fontFamily: tokens.typography.fontFamily.mono,
        ...tokens.typography.labelMono,
      },
      button: {
        fontWeight: 600,
        fontSize: '0.875rem',
        letterSpacing: '0.02em',
        textTransform: 'none' as const,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: '1rem',
        color: c.onSurfaceVariant,
      },
      overline: {
        fontFamily: tokens.typography.fontFamily.mono,
        fontSize: '0.6875rem',
        fontWeight: 500,
        lineHeight: '1rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      },
    },

    shape: {
      borderRadius: 8,
    },

    shadows: [
      'none',
      '0 1px 3px rgba(0,0,0,0.12)',
      '0 2px 6px rgba(0,0,0,0.16)',
      '0 4px 12px rgba(0,0,0,0.16)',
      '0 6px 16px rgba(0,0,0,0.18)',
      '0 8px 24px rgba(0,0,0,0.20)',
      '0 12px 32px rgba(0,0,0,0.22)',
      '0 16px 48px rgba(0,0,0,0.24)',
      ...Array(17).fill('0 16px 48px rgba(0,0,0,0.24)'),
    ] as ThemeOptions['shadows'],

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: c.surface,
            color: c.onSurface,
            scrollbarColor: `${c.outlineVariant} transparent`,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: c.outlineVariant,
              borderRadius: 3,
            },
          },
        },
      },

      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? tokens.colors.surfaceContainer : c.surfaceContainer,
            border: `1px solid ${c.outlineVariant}`,
            borderRadius: tokens.shape.xl,
          },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: isDark ? tokens.colors.surfaceContainerLow : c.surfaceContainerLow,
            border: `1px solid ${c.outlineVariant}`,
            borderRadius: tokens.shape.xl,
            backdropFilter: isDark ? 'blur(8px)' : undefined,
            transition: tokens.motion.normal,
            '&:hover': {
              borderColor: isDark ? 'rgba(192, 193, 255, 0.15)' : 'rgba(73, 75, 214, 0.2)',
              boxShadow: isDark
                ? '0 4px 24px rgba(0, 0, 0, 0.2)'
                : '0 4px 24px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: tokens.shape.md,
            fontWeight: 600,
            textTransform: 'none',
            padding: '8px 20px',
            transition: tokens.motion.fast,
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)'
              : 'linear-gradient(135deg, #494bd6 0%, #6366f1 100%)',
            color: isDark ? '#0d0096' : '#ffffff',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #9092ff 0%, #d0d1ff 100%)'
                : 'linear-gradient(135deg, #3f41c8 0%, #5558e0 100%)',
              boxShadow: isDark
                ? '0 0 20px rgba(128, 131, 255, 0.3)'
                : '0 0 20px rgba(73, 75, 214, 0.3)',
            },
          },
          outlined: {
            borderColor: c.outlineVariant,
            '&:hover': {
              borderColor: c.primary,
              backgroundColor: isDark ? 'rgba(192, 193, 255, 0.08)' : 'rgba(73, 75, 214, 0.08)',
            },
          },
          text: {
            '&:hover': {
              backgroundColor: isDark ? 'rgba(192, 193, 255, 0.08)' : 'rgba(73, 75, 214, 0.08)',
            },
          },
        },
      },

      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: tokens.shape.md,
              '& fieldset': { borderColor: c.outlineVariant },
              '&:hover fieldset': { borderColor: c.outline },
              '&.Mui-focused fieldset': { borderColor: c.primary },
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: tokens.shape['2xl'],
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.shape.md,
            transition: tokens.motion.fast,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? tokens.colors.surfaceContainerHighest : '#313033',
            color: isDark ? tokens.colors.onSurface : '#f4eff4',
            fontSize: '0.75rem',
            borderRadius: tokens.shape.md,
            padding: '6px 12px',
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? tokens.colors.surfaceContainerHigh : c.surfaceContainerHigh,
            borderRadius: tokens.shape['2xl'],
            border: `1px solid ${c.outlineVariant}`,
            backdropFilter: isDark ? 'blur(20px)' : undefined,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? tokens.colors.surfaceContainerLow : c.surfaceContainerLow,
            borderRight: `1px solid ${c.outlineVariant}`,
          },
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? 'rgba(11, 19, 38, 0.8)'
              : 'rgba(253, 251, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${c.outlineVariant}`,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${c.outlineVariant}`,
            padding: '12px 16px',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: tokens.typography.fontFamily.mono,
            color: c.onSurfaceVariant,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 44,
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-track': {
              backgroundColor: c.outlineVariant,
            },
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: c.outlineVariant,
          },
        },
      },

      MuiBadge: {
        styleOverrides: {
          badge: {
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: '0.625rem',
            fontWeight: 700,
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.shape.md,
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(192, 193, 255, 0.12)' : 'rgba(73, 75, 214, 0.12)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(192, 193, 255, 0.16)' : 'rgba(73, 75, 214, 0.16)',
              },
            },
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? tokens.colors.surfaceContainerHigh : c.surfaceContainerHigh,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: tokens.shape.lg,
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? tokens.colors.surfaceContainerHigh : c.surfaceContainerHigh,
            border: `1px solid ${c.outlineVariant}`,
            borderRadius: tokens.shape.lg,
            backdropFilter: isDark ? 'blur(20px)' : undefined,
          },
        },
      },
    },
  };
};

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
