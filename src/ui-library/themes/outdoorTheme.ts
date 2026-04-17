import { Theme } from './types';

/**
 * The Outdoor theme — inspired by forests, mountains, and trails.
 *
 * Color palette:
 *   Primary   → Forest Green  (#4A7C59)
 *   Secondary → Earth Brown   (#8B6347)
 *   Accent    → Sky Blue      (#4A85C4)
 *   Bg        → Parchment     (#F2EDE4)
 */
export const outdoorTheme: Theme = {
  name: 'outdoor',

  colors: {
    primary: '#4A7C59',
    primaryDark: '#2D5C3E',
    primaryLight: '#7AAD8A',

    secondary: '#8B6347',
    secondaryDark: '#5C3E2A',
    secondaryLight: '#B89578',

    accent: '#4A85C4',
    accentDark: '#2D6898',
    accentLight: '#7AABDB',

    background: '#F2EDE4',
    surface: '#FAFAF7',
    surfaceElevated: '#FFFFFF',

    textPrimary: '#1A2D1A',
    textSecondary: '#5C4A3A',
    textDisabled: '#A09585',
    textInverse: '#FAFAF7',

    border: '#C4BBAD',
    borderFocus: '#4A7C59',
    borderError: '#C0392B',

    error: '#C0392B',
    errorLight: '#FADBD8',
    warning: '#D4810E',
    warningLight: '#FAE5CB',
    success: '#3A7D44',
    successLight: '#D5EDD8',
    info: '#4A85C4',
    infoLight: '#D5E8F5',
  },

  typography: {
    fontFamily: "'Nunito', 'Segoe UI', system-ui, -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.05em',
    },
  },

  spacing: {
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(45,35,25,0.12), 0 1px 2px rgba(45,35,25,0.08)',
    md: '0 4px 6px rgba(45,35,25,0.12), 0 2px 4px rgba(45,35,25,0.08)',
    lg: '0 10px 15px rgba(45,35,25,0.14), 0 4px 6px rgba(45,35,25,0.08)',
    xl: '0 20px 25px rgba(45,35,25,0.15), 0 10px 10px rgba(45,35,25,0.08)',
    inner: 'inset 0 2px 4px rgba(45,35,25,0.10)',
  },

  transitions: {
    fast: '100ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
};
