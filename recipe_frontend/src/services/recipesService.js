/**
 * Recipes service built on top of mock data for now.
 * Exposes listRecipes and getRecipeById with simulated latency.
 * When backend is ready, swap data source to httpClient + mappers.
 */

import data from '../data/recipes.json'
import { mapRecipe, mapRecipesList } from './mappers'

// Simulated network latency in milliseconds
const MIN_LATENCY = 200
const MAX_LATENCY = 600

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomLatency() {
  return Math.floor(Math.random() * (MAX_LATENCY - MIN_LATENCY + 1)) + MIN_LATENCY
}

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\\w\\s-]/g, '')
}

// PUBLIC_INTERFACE
export async function listRecipes({ query = '', filters = {}, sort = { by: 'rating', dir: 'desc' }, page = 1, pageSize = 8 } = {}) {
  /** Returns a paginated list of recipes based on optional query, filters, and sort. */
  await sleep(randomLatency())

  // For future API switching:
  // const resp = await httpFetch('/recipes', { method: 'GET' })
  // let all = mapRecipesList(resp?.data)
  let all = mapRecipesList(data)

  // Text search against title, tags, categories, ingredients
  if (query) {
    const q = normalize(query)
    all = all.filter((r) => {
      const hay = [
        r.title,
        ...(r.tags || []),
        ...(r.categories || []),
        ...(r.ingredients || [])
      ]
        .map(normalize)
        .join(' ')
      return hay.includes(q)
    })
  }

  // Filters: difficulty, categories (array), tags (array), maxCookTime
  if (filters) {
    const { difficulty, categories, tags, maxCookTime, minRating } = filters

    if (difficulty) {
      const d = String(difficulty).toLowerCase()
      all = all.filter((r) => String(r.difficulty).toLowerCase() === d)
    }

    if (Array.isArray(categories) && categories.length) {
      const set = new Set(categories.map((c) => normalize(c)))
      all = all.filter((r) => (r.categories || []).some((c) => set.has(normalize(c))))
    }

    if (Array.isArray(tags) && tags.length) {
      const set = new Set(tags.map((t) => normalize(t)))
      all = all.filter((r) => (r.tags || []).some((t) => set.has(normalize(t))))
    }

    if (Number.isFinite(maxCookTime)) {
      all = all.filter((r) => Number(r.cookTime || 0) <= maxCookTime)
    }

    if (Number.isFinite(minRating)) {
      all = all.filter((r) => Number(r.rating || 0) >= minRating)
    }
  }

  // Sorting: by rating|cookTime|title; dir asc|desc
  const sBy = sort?.by || 'rating'
  const sDir = (sort?.dir || 'desc').toLowerCase() === 'asc' ? 1 : -1
  const cmp = {
    rating: (a, b) => (a.rating - b.rating) * sDir,
    cookTime: (a, b) => (a.cookTime - b.cookTime) * sDir,
    title: (a, b) => a.title.localeCompare(b.title) * sDir
  }[sBy] || ((a, b) => (a.rating - b.rating) * sDir)
  all = [...all].sort(cmp)

  // Pagination
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.max(1, parseInt(pageSize, 10) || 8)
  const total = all.length
  const start = (p - 1) * ps
  const end = start + ps
  const items = all.slice(start, end)

  return {
    items,
    total,
    page: p,
    pageSize: ps,
    totalPages: Math.max(1, Math.ceil(total / ps))
  }
}

// PUBLIC_INTERFACE
export async function getRecipeById(id) {
  /** Returns a single recipe by id from mock data with simulated latency. */
  await sleep(randomLatency())
  // Future API call:
  // const resp = await httpFetch(`/recipes/${id}`, { method: 'GET' })
  // return mapRecipe(resp?.data)

  const found = (data || []).find((r) => String(r.id) === String(id))
  return mapRecipe(found) || null
}

export default { listRecipes, getRecipeById }
