import { httpGet } from './httpClient'
import { mapRecipeList, mapRecipeDetail } from './mappers'

/**
 * Service layer for recipes - Placeholder
 * Stubs return mock data or empty arrays for now.
 */

// PUBLIC_INTERFACE
export async function fetchRecipes(params = {}) {
  /** Fetch a list of recipes; currently returns an empty mapped list. */
  try {
    // Placeholder: in future this could be httpGet('/api/recipes', params)
    const data = []
    return mapRecipeList(data)
  } catch (e) {
    return []
  }
}

// PUBLIC_INTERFACE
export async function fetchRecipeById(id) {
  /** Fetch a single recipe by ID; currently returns a minimal mapped object. */
  try {
    // Placeholder
    const data = id ? { id, title: 'Placeholder Recipe' } : null
    return mapRecipeDetail(data)
  } catch (e) {
    return null
  }
}
