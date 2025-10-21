 /**
  * Router configuration - Placeholder
  * Note: Not integrated with Application yet to avoid build changes.
  */

import RecipesList from '../pages/RecipesList'
import RecipeDetail from '../pages/RecipeDetail'
import NotFound from '../pages/NotFound'

// PUBLIC_INTERFACE
export const routes = [
  { path: '/', component: RecipesList, options: { name: 'HomeList' } },
  { path: '/recipe/:id', component: RecipeDetail, options: { name: 'RecipeDetail' } },
  { path: '(.*)', component: NotFound, options: { name: 'NotFound' } }
]

export default routes
