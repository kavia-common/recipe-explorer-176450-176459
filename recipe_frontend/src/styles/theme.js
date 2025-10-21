 /**
  * Theme builder for Ocean Professional
  * Consumes tokens and exposes helpers usable across components.
  */
import tokens from './tokens.js'

// PUBLIC_INTERFACE
export function focusRing(color = tokens.colors.focus, width = 3, offset = 2) {
  /** Returns CSS string for focus ring outline */
  const px = (n) => (typeof n === 'number' ? `${n}px` : String(n))
  const c = color || tokens.colors.focus
  return `outline: ${px(width)} solid ${c}; outline-offset: ${px(offset)};`
}

// PUBLIC_INTERFACE
export function surfaceLayer(variant = 'default') {
  /** Build a surface layer style object using gradients and subtle shadows */
  switch (variant) {
    case 'elevated':
      return { background: tokens.colors.surface, boxShadow: tokens.shadows.lg }
    case 'sunken':
      return { background: tokens.gradients.subtleOcean, boxShadow: tokens.shadows.inner }
    case 'default':
    default:
      return { background: tokens.gradients.subtleOcean, boxShadow: tokens.shadows.sm }
  }
}

const px = (n) => (typeof n === 'number' ? `${n}px` : String(n))

const theme = {
  name: 'Ocean Professional',
  tokens,
  spacing: (k = 4) => px(tokens.spacing[k] ?? k),
  radius: (k = 'md') => px(tokens.radii[k] ?? tokens.radii.md),
  text: {
    color: tokens.colors.text,
    muted: tokens.colors.textMuted,
    family: tokens.typography.fontFamily,
    size: (k = 'md') => px(tokens.typography.sizes[k] ?? tokens.typography.sizes.md),
    line: (k = 'normal') => tokens.typography.lineHeights[k] ?? tokens.typography.lineHeights.normal,
    weight: (k = 'regular') => tokens.typography.weights[k] ?? tokens.typography.weights.regular,
  },
  transition: {
    fast: tokens.transitions.fast,
    base: tokens.transitions.base,
    slow: tokens.transitions.slow,
  },
  helpers: {
    focusRing,
    surfaceLayer,
    px,
  },
}

export default theme
