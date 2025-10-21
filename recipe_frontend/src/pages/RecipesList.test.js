import { describe, it, expect, vi, beforeEach } from 'vitest'
import RecipesList from './RecipesList.js'
import store from '../state/store.js'
import * as actions from '../state/actions.js'
import data from '../data/recipes.json'

// Mock loadRecipes from actions to avoid network/service latency and just seed store
vi.spyOn(actions, 'loadRecipes').mockImplementation(async () => {
  // Seed using the store public API like in production load
  store.setRecipes(data.map(d => ({
    id: String(d.id),
    title: d.title,
    rating: Number(d.rating || 0),
    cookTime: Number(d.cookTime || 0),
    difficulty: d.difficulty || 'Unknown',
    servings: Number(d.servings || 0),
    categories: Array.isArray(d.categories) ? d.categories : [],
    tags: Array.isArray(d.tags) ? d.tags : [],
    ingredients: Array.isArray(d.ingredients) ? d.ingredients : [],
    steps: Array.isArray(d.steps) ? d.steps : [],
    cuisine: d.cuisine || '',
  })))
})

describe('RecipesList page', () => {
  beforeEach(() => {
    // Reset store to a clean state between tests
    store.replaceFilters({})
    store.setQuery('')
    store.setSort({ by: 'rating', direction: 'desc' })
    store.setPage(1)
  })

  it('loads and displays items count, reduces after applying a filter', async () => {
    const page = RecipesList.create()
    // Simulate mount lifecycle
    await page.mounted()

    const initialCount = page.totalOnPage
    expect(initialCount).toBeGreaterThan(0)

    // Apply a filter via store API to simulate user action
    const ref = store.state.recipes.find(r => r.tags?.length)
    const chosenTag = ref?.tags?.[0]
    store.setFilters({ tags: [chosenTag] })

    // Recompute page computed property by reading again
    const filteredCount = page.totalOnPage
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })
})
