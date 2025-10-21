 /**
  * Theme configuration - Ocean Professional (Placeholder)
  */

import tokens from './tokens'

// PUBLIC_INTERFACE
export default {
  name: 'Ocean Professional',
  colors: {
    primary: tokens.colors.primary,
    secondary: tokens.colors.secondary,
    success: tokens.colors.success,
    error: tokens.colors.error,
    background: tokens.colors.background,
    surface: tokens.colors.surface,
    text: tokens.colors.text
  },
  // Example elevation tokens, can be used for shadows later
  elevation: {
    low: 0.1,
    medium: 0.2,
    high: 0.3
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20
  }
}
