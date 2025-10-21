# Recipe Explorer Frontend (LightningJS + Vite)

## Overview
Recipe Explorer is a Lightning 3 Blits application that allows users to browse, search, and view recipes. By default, the app uses local mock data to provide a full experience without a backend. You can switch to a real backend via feature flags.

## Prerequisites
- Node.js 18+ and npm
- Recommended: Blits VS Code extension for syntax and autocompletion:
  https://marketplace.visualstudio.com/items?itemName=LightningJS.lightning-blits

## Project setup
Install dependencies:
```sh
npm install
```

## Running the app (development)
Start the dev server:
```sh
npm run dev
```
Vite will start a local server with hot reloading. Open the URL printed in your terminal.

Preview build locally:
```sh
npm run build
npm run preview
```
This serves the production build locally for verification.

## Build for production
Create an optimized production build:
```sh
npm run build
```
The build output will be available in the `dist` folder.

## Testing
This project uses Vitest with a JSDOM environment.
- Run tests:
```sh
npm test
```
- Watch mode:
```sh
npm run test:watch
```
Coverage reports are generated in `coverage/`.

## Feature flags and backend integration
The app supports toggling between mock data and a real backend using Vite environment variables. These are read via `import.meta.env` at runtime.

- VITE_USE_MOCK_DATA: "true" or "false"
  - Default: true (if not set, the services behave as mock mode)
  - When true, data is read from `src/data/recipes.json`
- VITE_API_BASE_URL: Backend base URL (e.g., http://localhost:8080)
  - Used only when `VITE_USE_MOCK_DATA` is false
  - Consumed by `src/services/httpClient.js`

Create a `.env` file in this folder:
```dotenv
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:8080
```

To switch to a real backend:
1. Set `VITE_USE_MOCK_DATA=false`.
2. Set `VITE_API_BASE_URL` to your backend URL.
3. Start the app. Services will call the backend using `src/services/httpClient.js` (see TODOs in services).
4. Ensure your backend matches the contract described in `docs/INTEGRATION_NOTES.md`.

See detailed integration guidance and API contracts in:
- `docs/INTEGRATION_NOTES.md`

## Source structure
- `src/services/recipesService.js`: Data access for recipe lists and details. Currently uses mock data, with TODOs for switching to backend.
- `src/services/httpClient.js`: Lightweight HTTP wrapper for backend calls (timeouts, JSON handling).
- `src/services/mappers.js`: Maps backend payloads to the UI model.
- `src/data/recipes.json`: Local mock data.
- `src/pages/` and `src/components/`: UI logic and components.
- `src/state/`: Global store and actions.
- `tests/` and `src/**/*.test.js`: Unit tests.

## Resources
- Blits documentation: https://lightningjs.io/v3-docs/blits/getting_started/intro.html
- Blits Example App: https://blits-demo.lightningjs.io/?source=true
- Blits Components: https://lightningjs.io/blits-components.html
