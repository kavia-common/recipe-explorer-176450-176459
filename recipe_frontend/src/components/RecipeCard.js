import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { toggleFavorite } from '../state/actions.js'

export default Blits.Component('RecipeCard', {
  props: ['recipe'],

  template: `
    <Element w="400" h="240" color="0xFFFFFFFF">
      <Text :content="$recipe?.title || 'Recipe'" x="10" y="10" fontSize="24" color="0x111827FF" />
      <Text :content="'Time: ' + ($recipe?.time || $recipe?.cookTime || 0) + ' min'" x="10" y="50" fontSize="20" color="0x6B7280FF" />
      <Text :content="'Rating: ' + ($recipe?.rating || 0)" x="10" y="80" fontSize="20" color="0x6B7280FF" />
      <Text :content="$isFav ? '★ Favorite' : '☆ Mark Favorite'" x="10" y="110" fontSize="22" :color="$isFav ? 0xF59E0BFF : 0x6B7280FF" />
      <Text content="[Enter] Toggle Favorite" x="10" y="210" fontSize="18" color="0x2563EBFF" />
    </Element>
  `,

  computed: {
    isFav() {
      const id = String(this.recipe?.id)
      return store.state.favorites.map(String).includes(id)
    },
  },

  input: {
    enter() {
      if (this.recipe && this.recipe.id != null) {
        toggleFavorite(this.recipe.id)
      }
    },
    back(e) {
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
