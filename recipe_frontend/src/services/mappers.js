/**
 * Mapping helpers to normalize API payloads to UI models.
 * Today we read from local JSON. Tomorrow we can switch to API and reuse these.
 */

// PUBLIC_INTERFACE
export function mapRecipe(apiRecipe) {
  /** Maps a single API recipe object to the UI recipe model. */
  if (!apiRecipe || typeof apiRecipe !== 'object') return null
  return {
    id: String(apiRecipe.id),
    title: apiRecipe.title ?? 'Untitled',
    image: apiRecipe.image ?? '',
    rating: Number(apiRecipe.rating ?? 0),
    cookTime: Number(apiRecipe.cookTime ?? 0),
    difficulty: apiRecipe.difficulty ?? 'Unknown',
    servings: Number(apiRecipe.servings ?? 0),
    categories: Array.isArray(apiRecipe.categories) ? apiRecipe.categories : [],
    tags: Array.isArray(apiRecipe.tags) ? apiRecipe.tags : [],
    ingredients: Array.isArray(apiRecipe.ingredients) ? apiRecipe.ingredients : [],
    steps: Array.isArray(apiRecipe.steps) ? apiRecipe.steps : [],
    nutrition: apiRecipe.nutrition ?? {}
  }
}

// PUBLIC_INTERFACE
export function mapRecipesList(apiRecipes) {
  /** Maps an array of API recipe objects to UI recipe models. */
  if (!Array.isArray(apiRecipes)) return []
  return apiRecipes.map(mapRecipe).filter(Boolean)
}

export default { mapRecipe, mapRecipesList }
