import { describe, it, expect, beforeAll, vi } from 'vitest'
import { listRecipes, getRecipeById } from './recipesService.js'
import raw from '../data/recipes.json'

// Speed up tests by stubbing latency helpers via global timers
// We can't directly import sleep/randomLatency from service, but calls await sleep(randomLatency()).
// We reduce impact by using fake timers and immediately advance timers when needed.
beforeAll(() => {
  vi.useFakeTimers()
})

// Helper to flush any pending timers between async calls.
async function flushTimers() {
  await vi.advanceTimersByTimeAsync(1000)
}

describe('recipesService.listRecipes', () => {
  it('returns paginated items and respects default sort by rating desc', async () => {
    const resPromise = listRecipes()
    await flushTimers()
    const res = await resPromise

    expect(res).toBeTruthy()
    expect(Array.isArray(res.items)).toBe(true)
    expect(typeof res.total).toBe('number')
    // Ensure sorted by rating desc
    const items = res.items
    if (items.length >= 2) {
      const pairSorted = [...items].sort((a, b) => b.rating - a.rating)
      expect(items[0].rating).toBe(pairSorted[0].rating)
    }
  })

  it('filters by query (matches title/tags/categories/ingredients)', async () => {
    // Choose a term known to exist from dataset
    const data = raw
    const target = data.find(r => r.title && r.title.length > 0)
    const term = target?.title?.split(' ')[0]
    const resPromise = listRecipes({ query: term })
    await flushTimers()
    const res = await resPromise

    expect(res.items.length).toBeGreaterThan(0)
    // All returned should contain the term within the searchable haystack
    const normalized = (s) => String(s || '').toLowerCase()
    const nterm = normalized(term)
    for (const r of res.items) {
      const hay = [
        r.title,
        ...(r.tags || []),
        ...(r.categories || []),
        ...(r.ingredients || [])
      ].map(normalized).join(' ')
      expect(hay.includes(nterm)).toBe(true)
    }
  })

  it('applies difficulty, tags and maxCookTime filters', async () => {
    // pick an element that has tags and a difficulty
    const data = raw
    const ref = data.find(r => r.tags?.length && r.difficulty)
    const tag = ref?.tags?.[0]
    const difficulty = ref?.difficulty
    const maxCookTime = Number(ref?.cookTime || 9999)

    const resPromise = listRecipes({
      filters: { tags: [tag], difficulty, maxCookTime }
    })
    await flushTimers()
    const res = await resPromise

    expect(res.items.length).toBeGreaterThan(0)
    for (const r of res.items) {
      expect(r.difficulty.toLowerCase()).toBe(String(difficulty).toLowerCase())
      expect(Number(r.cookTime)).toBeLessThanOrEqual(maxCookTime)
      expect(Array.isArray(r.tags)).toBe(true)
      expect(r.tags.map(t => String(t).toLowerCase())).toContain(String(tag).toLowerCase())
    }
  })

  it('sorts by title ascending when requested', async () => {
    const resPromise = listRecipes({ sort: { by: 'title', dir: 'asc' } })
    await flushTimers()
    const res = await resPromise

    const items = res.items
    const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title))
    // Compare first few to avoid strict equality when pagination slices
    for (let i = 0; i < Math.min(3, items.length); i++) {
      expect(items[i].title).toBe(sorted[i].title)
    }
  })
})

describe('recipesService.getRecipeById', () => {
  it('returns a single recipe mapped by id', async () => {
    const ref = raw[0]
    const resPromise = getRecipeById(ref.id)
    await flushTimers()
    const recipe = await resPromise
    expect(recipe).toBeTruthy()
    expect(String(recipe.id)).toBe(String(ref.id))
    expect(recipe.title).toBeTruthy()
  })

  it('returns null for missing id', async () => {
    const resPromise = getRecipeById('__nope__')
    await flushTimers()
    const recipe = await resPromise
    expect(recipe).toBeNull()
  })
})
