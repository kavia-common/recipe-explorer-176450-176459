import { describe, it, expect, vi, beforeEach } from 'vitest'
import RecipeCard from './RecipeCard.js'
import store from '../state/store.js'
import * as actions from '../state/actions.js'

// Minimal recipe fixture
const recipe = {
  id: 'r1',
  title: 'Test Pancakes',
  rating: 4.5,
  cookTime: 15,
  difficulty: 'Easy',
  servings: 2,
  tags: ['breakfast'],
  cuisine: 'American',
}

describe('RecipeCard', () => {
  beforeEach(() => {
    // Reset favorites in store to deterministic state
    store.favorites = []
    vi.restoreAllMocks()
  })

  it('renders title and computed favorite state', () => {
    const comp = RecipeCard.create({ recipe })
    // Render by calling template evaluation via Blits internals is out of scope in unit tests
    // but we can validate computed values and internal methods.
    expect(comp.recipe.title).toBe('Test Pancakes')
    expect(comp.isFav).toBe(false)
  })

  it('calls toggleFavorite action when $toggleFavorite is invoked', () => {
    const spy = vi.spyOn(actions, 'toggleFavorite').mockImplementation(() => {})
    const comp = RecipeCard.create({ recipe })
    comp.$toggleFavorite()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('r1')
  })

  it('navigates to detail when $open is called and $router exists', () => {
    const comp = RecipeCard.create({ recipe })
    const toSpy = vi.fn()
    comp.$router = { to: toSpy }
    comp.$open()
    expect(toSpy).toHaveBeenCalledWith('/recipe/r1')
  })
})
