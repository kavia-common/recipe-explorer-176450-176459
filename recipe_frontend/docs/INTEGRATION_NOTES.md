# Integration Notes

## Overview
This frontend currently uses mock data stored locally in `src/data/recipes.json` to provide a complete user experience while the backend is under development. The code is structured to switch seamlessly to a real backend once it becomes available. This document explains how to configure the app to use a backend, the expected API endpoints and payload shapes, and the feature flags you can use to toggle between mock data and real API.

## Feature Flags and Environment Variables
The app uses Vite for development, which exposes environment variables via `import.meta.env`. For integration, two variables are relevant:

- USE_MOCK_DATA
  - Type: boolean-like string ("true" or "false")
  - Purpose: Controls whether services fetch from local mock JSON or call the backend.
  - Default behavior: If not set, services default to mock data (current implementation).
- VITE_API_BASE_URL
  - Type: string
  - Purpose: Base URL for the backend API (e.g., https://api.example.com or http://localhost:8080).
  - Only used when USE_MOCK_DATA is false.

Create a `.env` file (or `.env.local`) in `recipe_frontend/` with:

```
USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:8080
```

When switching to the backend set:
- USE_MOCK_DATA=false
- VITE_API_BASE_URL=<your backend base URL>

Note: Environment variables must be prefixed with VITE_ to be exposed to client code. For convenience, we keep USE_MOCK_DATA without a prefix in docs, but when you implement the toggle in code you should read it via import.meta.env.VITE_USE_MOCK_DATA. See TODOs in services for guidance.

## Services Overview
- httpClient.js
  - Provides getBaseUrl() and httpFetch() to call the backend with a base URL, default JSON handling, timeouts, and error surfacing.
  - Reads import.meta.env.VITE_API_BASE_URL.
- recipesService.js
  - Currently reads from local mock data.
  - Structured to switch to httpClient(). The mapping helpers in mappers.js normalize API payloads for UI consumption.

## API Expectations
The following endpoints and payloads are expected by the frontend when using a real backend. Adjust your backend to match this contract or update the mappers accordingly.

### GET /recipes
- Query parameters (optional):
  - query: string — search term across title, tags, categories, ingredients
  - difficulty: string — e.g., "easy", "medium", "hard"
  - categories: string — comma-separated list, e.g., "italian,dessert"
  - tags: string — comma-separated list, e.g., "vegan,gluten-free"
  - maxCookTime: number — max cook time in minutes
  - minRating: number — minimum rating as a float or integer
  - sortBy: string — "rating" | "cookTime" | "title"
  - sortDir: string — "asc" | "desc"
  - page: number — 1-based
  - pageSize: number — default 8
- Response 200 (application/json):
```
{
  "items": [
    {
      "id": "123",
      "title": "Spaghetti Carbonara",
      "image": "https://...",
      "rating": 4.6,
      "cookTime": 25,
      "difficulty": "Medium",
      "servings": 2,
      "categories": ["Italian", "Pasta"],
      "tags": ["Quick", "Comfort Food"],
      "ingredients": ["200g spaghetti", "2 eggs", "..."],
      "steps": ["Boil pasta", "Mix eggs and cheese", "..."],
      "nutrition": {
        "calories": 550,
        "protein": "20g"
      }
    }
  ],
  "total": 57,
  "page": 1,
  "pageSize": 8,
  "totalPages": 8
}
```

Notes:
- The frontend maps payloads using mappers.js; additional fields will be ignored unless mapped explicitly.
- items may include more properties; ensure stable id is present as a string or mappable to string.

### GET /recipes/{id}
- Path parameter:
  - id: string or number
- Response 200 (application/json):
```
{
  "id": "123",
  "title": "Spaghetti Carbonara",
  "image": "https://...",
  "rating": 4.6,
  "cookTime": 25,
  "difficulty": "Medium",
  "servings": 2,
  "categories": ["Italian", "Pasta"],
  "tags": ["Quick", "Comfort Food"],
  "ingredients": ["200g spaghetti", "2 eggs", "..."],
  "steps": ["Boil pasta", "Mix eggs and cheese", "..."],
  "nutrition": {
    "calories": 550,
    "protein": "20g"
  }
}
```

Response codes:
- 200: recipe found
- 404: not found (client should handle and show a user-friendly message)

## Switching from Mock Data to Backend
1. Set environment variables:
   - VITE_USE_MOCK_DATA=false
   - VITE_API_BASE_URL=http://localhost:8080
2. Update recipesService.js to:
   - Read VITE_USE_MOCK_DATA (or default false).
   - When false, call httpFetch('/recipes', ...) and httpFetch(`/recipes/${id}`, ...).
   - Pass responses through mapRecipesList and mapRecipe.
3. Verify integration:
   - Start the frontend: npm run dev
   - Ensure network calls succeed (check browser devtools).
   - Run tests with mock mode enabled (tests assume mock data).

## Mapping Layer
See `src/services/mappers.js` for a definitive list of fields used by the UI. The mapping functions:
- mapRecipe(apiRecipe): normalizes fields and types
- mapRecipesList(apiRecipes): maps arrays via mapRecipe

If your backend returns different field names, adjust the mappers to avoid refactoring UI components.

## Testing Notes
- Unit tests use Vitest with a JSDOM environment.
- Tests currently exercise mock data flows.
- When integrating a real backend, preserve mock mode for deterministic tests by setting VITE_USE_MOCK_DATA=true during test runs, or by mocking httpClient.

Run tests:
```
npm test
```

## Error Handling and Timeouts
- httpClient.js enforces a default timeout of 15 seconds via AbortController.
- Non-2xx responses are converted to an Error with status and body for debugging.
- The UI should catch and display user-friendly messages.

## Security and CORS
- Ensure CORS is enabled on your backend for the frontend origin during development.
- Never commit actual secrets to the repo. Only non-sensitive endpoints/URLs should go in `.env` files.

## References
- httpClient.js: `src/services/httpClient.js`
- recipesService.js: `src/services/recipesService.js`
- mappers.js: `src/services/mappers.js`
- Mock data: `src/data/recipes.json`
