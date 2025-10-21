import Blits from '@lightningjs/blits'
import { listRecipes } from '../services/recipesService.js'

/**
 * Global application store for Recipe Explorer
 * Manages recipes, filters, query, sort, pagination, favorites, loading, and error states.
 * Also handles persistence of favorites to localStorage.
 */
const FAVORITES_KEY = 'recipe_favorites_v1'

// Load favorites from localStorage safely
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('Failed to parse favorites from localStorage', e)
    return []
  }
}

// Save favorites to localStorage safely
function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (e) {
    console.warn('Failed to save favorites to localStorage', e)
  }
}

// Initial state setup
const initialState = {
  recipes: [],            // all fetched recipes
  filtered: [],           // filtered recipes per filters/query/sort
  filters: {
    cuisine: null,
    difficulty: null,
    tags: [],             // array of strings
    maxTime: null,        // in minutes
  },
  query: '',              // free text search
  sort: {
    by: 'rating',         // rating | time | title
    direction: 'desc',    // asc | desc
  },
  pagination: {
    page: 1,
    pageSize: 12,
    total: 0,
  },
  favorites: loadFavorites(), // array of recipe ids
  loading: false,
  error: null,
}

// Utility: apply all filters/search/sort to recipes
function computeFiltered(state) {
  const { recipes, filters, query, sort } = state
  const q = (query || '').trim().toLowerCase()
  const { cuisine, difficulty, tags, maxTime } = filters

  let out = recipes.slice()

  // filter: cuisine
  if (cuisine) {
    out = out.filter(r => (r.cuisine || '').toLowerCase() === String(cuisine).toLowerCase())
  }

  // filter: difficulty
  if (difficulty) {
    out = out.filter(r => (r.difficulty || '').toLowerCase() === String(difficulty).toLowerCase())
  }

  // filter: tags
  if (tags && tags.length > 0) {
    const wanted = tags.map(t => String(t).toLowerCase())
    out = out.filter(r => {
      const rt = Array.isArray(r.tags) ? r.tags.map(t => String(t).toLowerCase()) : []
      return wanted.every(t => rt.includes(t))
    })
  }

  // filter: maxTime
  if (typeof maxTime === 'number' && !Number.isNaN(maxTime)) {
    out = out.filter(r => Number(r.time || r.cookTime || 0) <= maxTime)
  }

  // query: match title or description or ingredients
  if (q.length > 0) {
    out = out.filter(r => {
      const title = String(r.title || '').toLowerCase()
      const desc = String(r.description || '').toLowerCase()
      const ingredients = Array.isArray(r.ingredients) ? r.ingredients.join(' ').toLowerCase() : ''
      return title.includes(q) || desc.includes(q) || ingredients.includes(q)
    })
  }

  // sort
  const dir = sort.direction === 'asc' ? 1 : -1
  const by = sort.by
  out.sort((a, b) => {
    let av = a[by]
    let bv = b[by]
    // fallbacks for possible fields
    if (by === 'time') {
      av = Number(a.time || a.cookTime || 0)
      bv = Number(b.time || b.cookTime || 0)
    } else if (by === 'rating') {
      av = Number(a.rating || 0)
      bv = Number(b.rating || 0)
    } else if (by === 'title') {
      av = String(a.title || '').toLowerCase()
      bv = String(b.title || '').toLowerCase()
    }
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })

  return out
}

// Create Blits store
const store = Blits.Store({
  state: initialState,

  // PUBLIC_INTERFACE
  /** Update recipes data and compute derived filtered list and pagination total. */
  setRecipes(recipes) {
    this.recipes = Array.isArray(recipes) ? recipes : []
    const filtered = computeFiltered(this)
    this.filtered = filtered
    this.pagination.total = filtered.length
  },

  // PUBLIC_INTERFACE
  /** Set loading flag */
  setLoading(isLoading) {
    this.loading = !!isLoading
  },

  // PUBLIC_INTERFACE
  /** Set error text or object (stringified) */
  setError(err) {
    this.error = err ? String(err) : null
  },

  // PUBLIC_INTERFACE
  /** Set search query and recompute lists */
  setQuery(query) {
    this.query = String(query || '')
    const filtered = computeFiltered(this)
    this.filtered = filtered
    this.pagination.page = 1
    this.pagination.total = filtered.length
  },

  // PUBLIC_INTERFACE
  /** Update filters (partial), recompute lists */
  setFilters(partial) {
    this.filters = { ...this.filters, ...(partial || {}) }
    const filtered = computeFiltered(this)
    this.filtered = filtered
    this.pagination.page = 1
    this.pagination.total = filtered.length
  },

  // PUBLIC_INTERFACE
  /** Replace filters entirely, recompute lists */
  replaceFilters(nextFilters) {
    this.filters = { ...initialState.filters, ...(nextFilters || {}) }
    const filtered = computeFiltered(this)
    this.filtered = filtered
    this.pagination.page = 1
    this.pagination.total = filtered.length
  },

  // PUBLIC_INTERFACE
  /** Set sort and recompute lists */
  setSort(sort) {
    this.sort = { ...this.sort, ...(sort || {}) }
    const filtered = computeFiltered(this)
    this.filtered = filtered
    this.pagination.page = 1
    this.pagination.total = filtered.length
  },

  // PUBLIC_INTERFACE
  /** Set current page for pagination */
  setPage(page) {
    const p = Math.max(1, Number(page) || 1)
    this.pagination.page = p
  },

  // PUBLIC_INTERFACE
  /** Toggle favorite recipe id with persistence */
  toggleFavorite(recipeId) {
    const id = String(recipeId)
    const set = new Set(this.favorites.map(String))
    if (set.has(id)) set.delete(id)
    else set.add(id)
    this.favorites = Array.from(set)
    saveFavorites(this.favorites)
  },

  // PUBLIC_INTERFACE
  /** Hydrate favorites from storage (call at boot) */
  hydrateFavorites() {
    this.favorites = loadFavorites()
  },

  // PUBLIC_INTERFACE
  /** Async loader for recipes with loading and error flags */
  async loadRecipes() {
    this.setLoading(true)
    this.setError(null)
    try {
      // Request a large page to retrieve all results from mock service
      const res = await listRecipes({ page: 1, pageSize: 9999 })
      const data = Array.isArray(res?.items) ? res.items : []
      this.setRecipes(data)
    } catch (e) {
      console.error('Failed to load recipes', e)
      this.setError('Failed to load recipes')
      this.setRecipes([])
    } finally {
      this.setLoading(false)
    }
  },
})

export default store
