 /**
  * Router configuration for Recipe Explorer.
  * Includes:
  * - '/' -> RecipesList
  * - '/recipe/:id' -> RecipeDetail
  * - '/search' (optional placeholder route)
  * - 404 fallback
  */

import RecipesList from '../pages/RecipesList.js'
import RecipeDetail from '../pages/RecipeDetail.js'
import NotFound from '../pages/NotFound.js'

// PUBLIC_INTERFACE
export const routes = [
  { path: '/', component: RecipesList, options: { name: 'RecipesList' } },
  { path: '/recipe/:id', component: RecipeDetail, options: { name: 'RecipeDetail' } },
  { path: '/search', component: RecipesList, options: { name: 'Search' } },
  { path: '(.*)', component: NotFound, options: { name: 'NotFound' } }
]

export default routes
