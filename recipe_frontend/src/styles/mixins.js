 /**
  * Style mixins/helpers - Placeholder
  */

// PUBLIC_INTERFACE
export function withShadow(alpha = 0.15) {
  /** Returns a conceptual shadow intensity for future use. */
  return Math.max(0, Math.min(1, alpha))
}
