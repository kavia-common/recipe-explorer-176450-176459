 /**
  * Mapping utilities for recipes - Placeholder
  */

// PUBLIC_INTERFACE
export function mapRecipeList(items) {
  /** Maps raw list to UI list shape. */
  return Array.isArray(items) ? items.map(mapRecipeSummary) : []
}

// PUBLIC_INTERFACE
export function mapRecipeDetail(item) {
  /** Maps a single raw item to a UI detail shape. */
  if (!item) return null
  return {
    id: item.id ?? '',
    title: item.title ?? 'Untitled',
    description: item.description ?? '',
    rating: item.rating ?? 0,
    tags: item.tags ?? []
  }
}

function mapRecipeSummary(item) {
  return {
    id: item.id ?? '',
    title: item.title ?? 'Untitled',
    rating: item.rating ?? 0
  }
}
