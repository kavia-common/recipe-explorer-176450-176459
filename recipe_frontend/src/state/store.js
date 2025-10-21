 /**
  * Simple global store - Placeholder
  * This is a tiny pub/sub-like object; can be replaced with Blits plugins later.
  */

const subscribers = new Set()
const state = {
  // minimal app state
  recipes: [],
  selectedRecipeId: null,
  query: ''
}

// PUBLIC_INTERFACE
export function getState() {
  /** Returns current state snapshot. */
  return { ...state }
}

// PUBLIC_INTERFACE
export function setState(partial) {
  /** Merges provided partial into state and notifies subscribers. */
  Object.assign(state, partial || {})
  subscribers.forEach((cb) => {
    try { cb(getState()) } catch (e) { /* ignore */ }
  })
  return getState()
}

// PUBLIC_INTERFACE
export function subscribe(callback) {
  /** Subscribe to state updates; returns an unsubscribe function. */
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}
