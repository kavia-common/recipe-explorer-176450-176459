import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { toggleFavorite } from '../state/actions.js'
import RatingStars from './RatingStars.js'
import Badge from './Badge.js'

/**
 * RecipeCard
 * Focusable card that shows key info and supports:
 * - Enter: navigate to detail
 * - Info key (or Blue): toggle favorite
 * - Back: bubble
 * Adds ARIA roles and labels for a11y.
 */
export default Blits.Component('RecipeCard', {
  components: { RatingStars, Badge },
  props: ['recipe'],

  state() {
    return {
      focused: false,
    }
  },

  template: `
    <Element
      w="400"
      h="240"
      rect="true"
      :color="$focused ? 0xFFFFFFFF : 0xFFFDFDFD"
      :alpha="$focused ? 1 : 0.95"
      role="group"
      :aria-label="($recipe?.title || 'Recipe') + ' card'"
    >
      <!-- Focus ring -->
      <Element w="400" h="240" rect="true" :color="$focused ? 0x2563EB22 : 0x00000000" />

      <!-- Title (acts as open button) -->
      <Element x="16" y="8" w="360" h="40" role="button" aria-label="Open recipe details" @enter="$open">
        <Text :content="$recipe?.title || 'Recipe'" x="0" y="6" fontSize="26" color="0x111827FF" />
      </Element>

      <!-- Sub info row -->
      <Element x="16" y="54" w="368" h="28" role="note" :aria-label="'Time ' + ($recipe?.time || $recipe?.cookTime || 0) + ' minutes, Difficulty ' + ($recipe?.difficulty || 'unknown')">
        <Text :content="'Time: ' + ($recipe?.time || $recipe?.cookTime || 0) + 'm'" fontSize="20" color="0x6B7280FF" />
        <Text :content="' • Difficulty: ' + ($recipe?.difficulty || '—')" x="170" fontSize="20" color="0x6B7280FF" />
      </Element>

      <!-- Rating -->
      <Element x="16" y="88" w="360" h="28" role="img" :aria-label="'Rating ' + ($recipe?.rating || 0) + ' out of 5'">
        <RatingStars :value="$recipe?.rating || 0" :count="$recipe?.reviews || 0" />
      </Element>

      <!-- Tags/Badges (example: cuisine + servings) -->
      <Element x="16" y="126" w="368" h="40" role="group" aria-label="Recipe attributes">
        <Badge :label="($recipe?.cuisine || '—')" />
        <Badge :label="'Serves ' + ($recipe?.servings || 0)" :x="180" />
      </Element>

      <!-- Favorite control -->
      <Element x="16" y="172" w="180" h="32" role="button" :aria-pressed="$isFav" :aria-label="$isFav ? 'Remove from favorites' : 'Add to favorites'" @enter="$toggleFavorite">
        <Text :content="$isFav ? '★ Favorite' : '☆ Mark Favorite'" fontSize="22" :color="$isFav ? 0xF59E0BFF : 0x6B7280FF" />
      </Element>

      <!-- Help row -->
      <Text content="[Enter] Open   [Info] Favorite" x="16" y="208" fontSize="18" color="0x2563EBFF" />
    </Element>
  `,

  computed: {
    isFav() {
      const id = String(this.recipe?.id)
      return store.state.favorites.map(String).includes(id)
    },
  },

  methods: {
    // PUBLIC_INTERFACE
    /** Visual focus state toggle to show focus ring */
    setFocused(v) {
      this.focused = !!v
    },
    // PUBLIC_INTERFACE
    /** Navigate to recipe detail route. */
    $open() {
      if (this.recipe && this.recipe.id != null && this.$router) {
        this.$router.to(`/recipe/${this.recipe.id}`)
      }
    },
    // PUBLIC_INTERFACE
    /** Toggle favorite for the card recipe id. */
    $toggleFavorite() {
      if (this.recipe && this.recipe.id != null) {
        toggleFavorite(this.recipe.id)
      }
    }
  },

  focus() {
    this.setFocused(true)
  },
  blur() {
    this.setFocused(false)
  },

  input: {
    enter() {
      this.$open()
    },
    info() {
      this.$toggleFavorite()
    },
    // Some remotes use 'blue' key as info; map here as well
    blue() {
      this.$toggleFavorite()
    },
    back(e) {
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
