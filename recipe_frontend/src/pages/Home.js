import Blits from '@lightningjs/blits'
import { listRecipes } from '../services/recipesService.js'
import RecipeCard from '../components/RecipeCard.js'
import Loader from '../components/Loader.js'

export default Blits.Component('Home', {
  components: { RecipeCard, Loader },
  state() {
    return {
      loading: true,
      featured: []
    }
  },
  async onCreate() {
    try {
      const { items } = await listRecipes({ sort: { by: 'rating', dir: 'desc' }, page: 1, pageSize: 6 })
      this.featured = items
    } catch (e) {
      this.featured = []
    } finally {
      this.loading = false
    }
  },
  template: `
    <Element w="1920" h="1080">
      <Text content="Welcome to Recipe Explorer" x="100" y="60" />
      <Loader :visible="$loading" x="100" y="100" />
      <Element :alpha="$loading ? 0 : 1">
        <Element
          :for="(item, idx) in $featured"
          :key="$item.id"
          :x="100 + ($idx % 3) * 420"
          :y="140 + Math.floor($idx / 2) * 320"
          w="400"
          h="300"
        >
          <RecipeCard :recipe="$item" />
        </Element>
      </Element>
    </Element>
  `
})
