 /**
  * Action constants and creators - Placeholder
  */

// PUBLIC_INTERFACE
export const ACTIONS = {
  SET_RECIPES: 'SET_RECIPES',
  SET_SELECTED_RECIPE: 'SET_SELECTED_RECIPE',
  SET_QUERY: 'SET_QUERY'
}

// PUBLIC_INTERFACE
export function setRecipes(recipes) {
  /** Creates action for setting recipe list. */
  return { type: ACTIONS.SET_RECIPES, payload: recipes || [] }
}

// PUBLIC_INTERFACE
export function setSelectedRecipe(id) {
  /** Creates action for selecting recipe id. */
  return { type: ACTIONS.SET_SELECTED_RECIPE, payload: id || null }
}

// PUBLIC_INTERFACE
export function setQuery(q) {
  /** Creates action for setting search query. */
  return { type: ACTIONS.SET_QUERY, payload: q || '' }
}
