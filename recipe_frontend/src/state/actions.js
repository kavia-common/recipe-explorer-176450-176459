import store from './store.js'

/**
 * Action layer for Recipe Explorer.
 * Components should import actions to interact with the global store.
 */

// PUBLIC_INTERFACE
/** Load recipes from service, handles loading and error states. */
export async function loadRecipes() {
  await store.loadRecipes()
}

// PUBLIC_INTERFACE
/** Apply a partial set of filters (e.g., { cuisine, difficulty, tags, maxTime }). */
export function applyFilters(partialFilters) {
  store.setFilters(partialFilters)
}

// PUBLIC_INTERFACE
/** Set the search query string to filter recipes by title/description/ingredients. */
export function setQuery(query) {
  store.setQuery(query)
}

// PUBLIC_INTERFACE
/** Toggle favorite status for a recipe id and persist to localStorage. */
export function toggleFavorite(recipeId) {
  store.toggleFavorite(recipeId)
}

// PUBLIC_INTERFACE
/** Set pagination page number. */
export function setPage(page) {
  store.setPage(page)
}

// PUBLIC_INTERFACE
/** Set sorting and recompute (by: rating|time|title, direction: asc|desc). */
export function setSort(sort) {
  store.setSort(sort)
}
