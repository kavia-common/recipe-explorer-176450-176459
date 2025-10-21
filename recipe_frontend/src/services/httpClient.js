/**
 * Lightweight HTTP client wrapper for future backend calls.
 * Uses fetch under the hood and reads BASE_URL from environment.
 * For now, services use local mock data; this is a forward-compatible stub.
 *
 * Integration docs:
 * See docs/INTEGRATION_NOTES.md for environment variables and API expectations.
 * - VITE_API_BASE_URL: base URL for the backend
 * - VITE_USE_MOCK_DATA: when true, services should avoid calling httpFetch
 */

const DEFAULT_TIMEOUT_MS = 15000

// PUBLIC_INTERFACE
export function getBaseUrl() {
  /** Returns the backend base URL from env (if configured). */
  // NOTE: Vite exposes env vars as import.meta.env
  // TODO: Provide a .env.example including VITE_API_BASE_URL and VITE_USE_MOCK_DATA.
  return (import.meta?.env?.VITE_API_BASE_URL || '').toString()
}

/**
 * PUBLIC_INTERFACE
 * Performs a fetch with base URL and JSON handling.
 */
export async function httpFetch(path, options = {}) {
  /**
   * Wrapper around fetch that prefixes BASE_URL and handles JSON parsing, timeouts, and errors.
   * TODO: Consider injecting auth headers here if backend requires authentication.
   */
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeout ?? DEFAULT_TIMEOUT_MS)

  const base = getBaseUrl()
  // Normalize slashes
  const baseNoSlash = base.endsWith('/') ? base.slice(0, -1) : base
  const pathNoSlash = (path || '').startsWith('/') ? path.slice(1) : (path || '')
  const url = baseNoSlash ? `${baseNoSlash}/${pathNoSlash}` : pathNoSlash

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const err = new Error(`HTTP ${res.status}: ${res.statusText}`)
      err.status = res.status
      err.body = text
      throw err
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return await res.json()
    }
    return await res.text()
  } finally {
    clearTimeout(timeout)
  }
}

export default { httpFetch, getBaseUrl }
