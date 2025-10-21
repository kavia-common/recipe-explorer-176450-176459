 /**
  * Reusable mixins/utilities for styles.
  * These return plain objects or strings so they can be applied in JS style maps.
  */
import theme from './theme.js'

// PUBLIC_INTERFACE
export function visuallyHidden() {
  /** Returns an object that visually hides content but keeps it accessible */
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  }
}

// PUBLIC_INTERFACE
export function clampFluid(minPx, preferredPx, maxPx) {
  /** Returns a CSS clamp() string */
  return `clamp(${minPx}px, ${preferredPx}px, ${maxPx}px)`
}

// PUBLIC_INTERFACE
export function card() {
  /** Surface card with subtle elevation */
  const surf = theme.helpers.surfaceLayer('elevated')
  return {
    background: surf.background,
    boxShadow: surf.boxShadow,
    borderRadius: theme.radius('lg'),
    border: `1px solid ${theme.tokens.colors.border}`,
  }
}

// PUBLIC_INTERFACE
export function buttonBase({ variant = 'primary' } = {}) {
  /** Base button visual with accessible contrast and motion */
  const bg = variant === 'secondary' ? theme.tokens.colors.secondary : theme.tokens.colors.primary
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: theme.radius('md'),
    color: '#fff',
    background: bg,
    border: 'none',
    boxShadow: theme.tokens.shadows.sm,
    transition: `transform ${theme.transition.fast}, box-shadow ${theme.transition.base}, background-color ${theme.transition.base}`,
    cursor: 'pointer',
  }
}

export default {
  visuallyHidden,
  clampFluid,
  card,
  buttonBase,
}
