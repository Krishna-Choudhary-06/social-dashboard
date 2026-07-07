// ============================================================
// Design Tokens - Derived from Stitch Design System
// "Lumina Analytics" — Deep Space dark theme
// ============================================================

export const tokens = {
  colors: {
    // ---- Surface ----
    surface: '#0b1326',
    surfaceDim: '#0b1326',
    surfaceBright: '#31394d',
    surfaceContainerLowest: '#060e20',
    surfaceContainerLow: '#131b2e',
    surfaceContainer: '#171f33',
    surfaceContainerHigh: '#222a3d',
    surfaceContainerHighest: '#2d3449',

    // ---- On Surface ----
    onSurface: '#dae2fd',
    onSurfaceVariant: '#c7c4d7',
    inverseSurface: '#dae2fd',
    inverseOnSurface: '#283044',

    // ---- Outline ----
    outline: '#908fa0',
    outlineVariant: '#464554',

    // ---- Primary (Indigo) ----
    primary: '#c0c1ff',
    onPrimary: '#1000a9',
    primaryContainer: '#8083ff',
    onPrimaryContainer: '#0d0096',
    inversePrimary: '#494bd6',

    // ---- Secondary (Pink) ----
    secondary: '#ffb0cd',
    onSecondary: '#640039',
    secondaryContainer: '#aa0266',
    onSecondaryContainer: '#ffbad3',

    // ---- Tertiary (Cyan) ----
    tertiary: '#4cd7f6',
    onTertiary: '#003640',
    tertiaryContainer: '#009eb9',
    onTertiaryContainer: '#002f38',

    // ---- Error ----
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',

    // ---- Success (custom) ----
    success: '#4caf50',
    warning: '#ff9800',

    // ---- Platform Brand Colors ----
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    youtube: '#FF0000',
    tiktok: '#69C9D0',
  },

  // ---- Light Mode Overrides ----
  lightColors: {
    surface: '#fdfbff',
    surfaceDim: '#ddd8e4',
    surfaceBright: '#fdfbff',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f8f2fe',
    surfaceContainer: '#f2ecf8',
    surfaceContainerHigh: '#ece6f2',
    surfaceContainerHighest: '#e6e0ec',
    onSurface: '#1c1b1f',
    onSurfaceVariant: '#49454f',
    outline: '#79747e',
    outlineVariant: '#cac4d0',
    primary: '#494bd6',
    onPrimary: '#ffffff',
    primaryContainer: '#e1e0ff',
    onPrimaryContainer: '#07006c',
    secondary: '#8c0053',
    onSecondary: '#ffffff',
    secondaryContainer: '#ffd9e4',
    onSecondaryContainer: '#3e0022',
    tertiary: '#006878',
    onTertiary: '#ffffff',
    tertiaryContainer: '#acedff',
    onTertiaryContainer: '#001f26',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    inverseSurface: '#313033',
    inverseOnSurface: '#f4eff4',
    inversePrimary: '#c0c1ff',
  },

  typography: {
    fontFamily: {
      headline: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "Geist Mono", "SF Mono", monospace',
    },
    displayLg: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: '3.5rem',
      letterSpacing: '-0.02em',
    },
    headlineLg: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: '2.5rem',
      letterSpacing: '-0.01em',
    },
    headlineMd: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: '2rem',
    },
    bodyLg: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: '1.75rem',
    },
    bodyMd: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem',
    },
    bodySm: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.25rem',
    },
    labelMono: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: '1rem',
      letterSpacing: '0.05em',
    },
  },

  shape: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  spacing: {
    unit: 4,
    gutter: 24,
    marginMobile: 16,
    marginDesktop: 40,
    sidebarExpanded: 280,
    sidebarCollapsed: 72,
  },

  elevation: {
    glass: {
      backdropFilter: 'blur(20px)',
      background: 'rgba(23, 31, 51, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    },
    glassLight: {
      backdropFilter: 'blur(12px)',
      background: 'rgba(23, 31, 51, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.04)',
    },
    card: {
      backdropFilter: 'blur(8px)',
      background: 'rgba(23, 31, 51, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
    },
  },

  motion: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: { type: 'spring', stiffness: 300, damping: 30 } as const,
  },
} as const;

export type DesignTokens = typeof tokens;
