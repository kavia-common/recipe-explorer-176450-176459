 /**
  * Ocean Professional Design Tokens
  * Centralized design primitives for color, spacing, typography, radii, shadows and transitions.
  * These tokens are consumed by the theme builder in theme.js.
  */

 // PUBLIC_INTERFACE
const tokens = {
  colors: {
    primary: '#2563EB', // Blue-600
    secondary: '#F59E0B', // Amber-500
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    error: '#EF4444', // Red-500
    info: '#3B82F6', // Blue-500
    background: '#f9fafb', // Gray-50
    surface: '#ffffff', // White
    text: '#111827', // Gray-900
    textMuted: '#4B5563', // Gray-600
    border: '#E5E7EB', // Gray-200
    overlay: 'rgba(17, 24, 39, 0.6)',
    focus: '#2563EB',
  },

  spacing: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    56: 224,
    64: 256,
  },

  radii: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 9999,
    round: 9999,
  },

  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.06)',
    sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
    xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },

  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeights: {
      tight: 1.2,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.625,
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  transitions: {
    fast: '120ms ease-out',
    base: '180ms ease',
    slow: '280ms ease-in',
  },

  gradients: {
    subtleOcean:
      'linear-gradient(180deg, rgba(59,130,246,0.10) 0%, rgba(249,250,251,1) 100%)',
  },
};

export default tokens
