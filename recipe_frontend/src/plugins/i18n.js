import Blits from '@lightningjs/blits'

/**
 * Minimal i18n helper to prepare for future localization without changing UI copy.
 * This exposes a PUBLIC_INTERFACE function t(key, fallback?) and maintains a simple
 * strings map by locale. Current visible strings remain unchanged elsewhere.
 */

// Basic registry; can be extended later or loaded dynamically.
const STRINGS = {
  en: {
    'a11y.skip_to_content': 'Skip to main content',
    'a11y.search': 'Search recipes',
    'a11y.search_clear': 'Clear search query',
    'a11y.filter.toggle': 'Toggle filter',
    'a11y.favorite.add': 'Add to favorites',
    'a11y.favorite.remove': 'Remove from favorites',
    'a11y.pagination.next': 'Next page',
    'a11y.pagination.prev': 'Previous page',
    'a11y.pagination.page': 'Go to page',
    'a11y.card.open': 'Open recipe details',
    'a11y.loading': 'Loading',
    'a11y.loaded': 'Loaded',
  }
}

let currentLocale = 'en'

/**
 * PUBLIC_INTERFACE
 * Set the current locale. Falls back to 'en' if missing.
 */
/** Set the current locale */
export function setLocale(locale) {
  currentLocale = STRINGS[locale] ? locale : 'en'
}

/**
 * PUBLIC_INTERFACE
 * Translate a key for the current locale, falling back to provided default or key.
 */
/** Translate a key with optional fallback */
export function t(key, fallback) {
  return (STRINGS[currentLocale] && STRINGS[currentLocale][key]) || fallback || key
}

/**
 * PUBLIC_INTERFACE
 * Register/extend strings for a specific locale.
 */
/** Extend/add strings for a locale */
export function registerStrings(locale, map) {
  STRINGS[locale] = { ...(STRINGS[locale] || {}), ...(map || {}) }
}

export default {
  install(app) {
    // Provide a global $t helper to all components
    app.provide('$t', t)
  }
}
