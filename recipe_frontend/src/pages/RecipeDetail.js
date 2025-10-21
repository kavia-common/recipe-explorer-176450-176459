import Blits from '@lightningjs/blits'
import { getRecipeById } from '../services/recipesService.js'
import store from '../state/store.js'
import { toggleFavorite } from '../state/actions.js'
import Loader from '../components/Loader.js'
import RatingStars from '../components/RatingStars.js'
import Badge from '../components/Badge.js'
import Tag from '../components/Tag.js'

/**
 * RecipeDetail
 * - Loads recipe by id using service
 * - Renders hero image/title, meta badges, rating
 * - Sections: Ingredients (locally checkable), Steps, Nutrition badges
 * - Favorite toggle and Back to list (preserves list state)
 * - Keyboard navigation: switch focus across [Back, Fav, Ingredients, Steps, Nutrition]
 * - Uses theme tokens for colors and spacing
 */
export default Blits.Component('RecipeDetail', {
  components: { Loader, RatingStars, Badge, Tag },
  props: ['id'],

  state() {
    return {
      loading: true,
      error: null,
      recipe: null,

      // UI / focus
      focusIndex: 0, // 0: Back, 1: Favorite, 2: Ingredients, 3: Steps, 4: Nutrition
      sectionIndex: 0, // sub index within focused section (e.g., ingredient row)
      checked: {}, // local checkbox map for ingredients
    }
  },

  async onCreate() {
    try {
      this.loading = true
      this.error = null
      const rec = await getRecipeById(this.id)
      this.recipe = rec
      const init = {}
      ;(rec?.ingredients || []).forEach((_, i) => { init[i] = false })
      this.checked = init
    } catch (e) {
      console.error(e)
      this.error = 'Failed to load recipe'
      this.recipe = null
    } finally {
      this.loading = false
    }
  },

  computed: {
    bg() { return 0xfff9fafb },
    surface() { return 0xffffffff },
    primary() { return 0xff2563eb },
    muted() { return 0xff6B7280 },
    danger() { return 0xffEF4444 },
    accent() { return 0xffF59E0B },
    text() { return 0xff111827 },

    isFav() {
      const id = String(this.recipe?.id)
      return store.state.favorites.map(String).includes(id)
    },

    // Sizes
    heroH() { return 260 },
    heroW() { return 860 },

    ingredientsCount() { return (this.recipe?.ingredients || []).length },
    stepsCount() { return (this.recipe?.steps || []).length },
  },

  methods: {
    // PUBLIC_INTERFACE
    /** Navigate back to list without losing list state (router back). */
    backToList() {
      if (this.$router) this.$router.back()
    },

    // PUBLIC_INTERFACE
    /** Toggle favorite status via store action. */
    favToggle() {
      if (!this.recipe?.id) return
      toggleFavorite(this.recipe.id)
    },

    // PUBLIC_INTERFACE
    /** Toggle ingredient checkbox at current sectionIndex. */
    toggleIngredient(index = this.sectionIndex) {
      if (this.focusIndex !== 2) return // ingredients focus only
      const i = Math.max(0, Math.min(this.ingredientsCount - 1, index))
      const next = { ...this.checked, [i]: !this.checked[i] }
      this.checked = next
    },

    // PUBLIC_INTERFACE
    /** Move focus across header actions and sections. */
    moveFocus(delta) {
      const max = 4
      const next = Math.max(0, Math.min(max, this.focusIndex + delta))
      if (next !== this.focusIndex) this.sectionIndex = 0
      this.focusIndex = next
    },

    // PUBLIC_INTERFACE
    /** Move within a section (ingredients or steps). */
    moveSection(delta) {
      if (this.focusIndex === 2) {
        const max = Math.max(0, this.ingredientsCount - 1)
        this.sectionIndex = Math.max(0, Math.min(max, this.sectionIndex + delta))
      } else if (this.focusIndex === 3) {
        const max = Math.max(0, this.stepsCount - 1)
        this.sectionIndex = Math.max(0, Math.min(max, this.sectionIndex + delta))
      }
    },

    // PUBLIC_INTERFACE
    /** Returns true if given header button index is focused. */
    isHeaderFocused(idx) {
      return this.focusIndex === idx
    },

    // PUBLIC_INTERFACE
    /** Returns focus flag for ingredient row. */
    isIngredientFocused(idx) {
      return this.focusIndex === 2 && this.sectionIndex === idx
    },

    // PUBLIC_INTERFACE
    /** Returns focus flag for step row. */
    isStepFocused(idx) {
      return this.focusIndex === 3 && this.sectionIndex === idx
    },
  },

  input: {
    left() { this.moveFocus(-1) },
    right() { this.moveFocus(1) },
    up() { this.moveSection(-1) },
    down() { this.moveSection(1) },

    enter() {
      if (this.focusIndex === 0) {
        this.backToList()
      } else if (this.focusIndex === 1) {
        this.favToggle()
      } else if (this.focusIndex === 2) {
        this.toggleIngredient(this.sectionIndex)
      }
    },

    back(e) {
      if (this.$router) return this.$router.back()
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },

  template: `
    <Element w="1824" h="912" x="0" y="0">
      <!-- Loading and error states -->
      <Element :alpha="$loading ? 1 : 0" x="40" y="40"><Loader /></Element>
      <Element :alpha="$error && !$loading ? 1 : 0" x="40" y="40"><Text :content="$error" fontSize="28" :color="$danger" /></Element>

      <Element :alpha="!$loading && !$error ? 1 : 0">
        <!-- Header bar with Back and Favorite -->
        <Element x="40" y="24" w="1744" h="72">
          <!-- Back -->
          <Element
            x="0" y="0" w="160" h="56" rect="true"
            :color="$isHeaderFocused(0) ? 0x2563EB22 : 0x00000000"
            :alpha="$isHeaderFocused(0) ? 1 : 0.85"
          >
            <Text content="← Back" x="16" y="12" fontSize="28" :color="$isHeaderFocused(0) ? $primary : $muted" />
          </Element>

          <!-- Favorite -->
          <Element
            x="172" y="0" w="220" h="56" rect="true"
            :color="$isHeaderFocused(1) ? 0xF59E0B22 : 0x00000000"
            :alpha="$isHeaderFocused(1) ? 1 : 0.85"
          >
            <Text :content="$isFav ? '★ Favorited' : '☆ Favorite'" x="16" y="12" fontSize="28" :color="$isFav ? $accent : $muted" />
          </Element>
        </Element>

        <!-- Hero section -->
        <Element x="40" y="96" w="1744" h="260" rect="true" :color="$surface" :alpha="1">
          <!-- Image placeholder block (replace with image when available) -->
          <Element x="16" y="16" :w="$heroW" :h="$heroH" rect="true" color="0xffE5E7EB">
            <Text content="Image" x="20" y="20" fontSize="22" :color="$muted" />
          </Element>

          <!-- Title and meta -->
          <Element :x="16 + $heroW + 24" y="16" w="800" :h="$heroH">
            <Text :content="$recipe?.title || 'Recipe not found'" fontSize="40" :color="$text" />
            <Element y="56" w="600" h="28">
              <RatingStars :value="$recipe?.rating || 0" :count="$recipe?.reviews || 0" />
            </Element>
            <Element y="100" w="760" h="40">
              <Badge :label="'Time: ' + ($recipe?.cookTime || 0) + 'm'" />
              <Badge :label="'Serves: ' + ($recipe?.servings || 0)" :x="220" />
              <Badge :label="'Difficulty: ' + ($recipe?.difficulty || '—')" :x="440" />
            </Element>
            <Element y="152" w="760" h="84">
              <Element :for="(t, i) in $recipe?.tags || []" :key="$t" :x="($i%5)*150" :y="Math.floor($i/5)*44">
                <Tag :text="$t" />
              </Element>
            </Element>
          </Element>
        </Element>

        <!-- Content columns -->
        <Element x="40" y="372" w="1744" h="520">
          <!-- Ingredients -->
          <Element x="0" y="0" w="540" h="520" rect="true" :color="$surface" :alpha="1">
            <Text content="Ingredients" x="16" y="12" fontSize="28" :color="$text" />
            <Element y="52" x="8" w="520" h="460">
              <Element
                :for="(ing, idx) in $recipe?.ingredients || []"
                :key="'ing'+$idx"
                :y="$idx * 36"
                w="520" h="32"
                rect="true"
                :color="$isIngredientFocused($idx) ? 0x2563EB18 : 0x00000000"
              >
                <!-- Checkbox -->
                <Element :x="8" y="4" w="24" h="24" rect="true" color="0xffE5E7EB">
                  <Text
                    :alpha="$checked[$idx] ? 1 : 0"
                    content="✓" x="4" y="-2" fontSize="24" :color="$primary"
                  />
                </Element>
                <!-- Label -->
                <Text :content="$ing" x="40" y="2" fontSize="22" :color="$text" />
              </Element>
            </Element>
            <!-- Focus hint -->
            <Text content="[Up/Down] Navigate   [Enter] Check" x="16" y="488" fontSize="18" :color="$muted" />
          </Element>

          <!-- Steps -->
          <Element x="564" y="0" w="620" h="520" rect="true" :color="$surface" :alpha="1">
            <Text content="Steps" x="16" y="12" fontSize="28" :color="$text" />
            <Element y="52" x="8" w="604" h="440">
              <Element
                :for="(st, idx) in $recipe?.steps || []"
                :key="'st'+$idx"
                :y="$idx * 40"
                w="604" h="36"
                rect="true"
                :color="$isStepFocused($idx) ? 0x2563EB18 : 0x00000000"
              >
                <Text :content="($idx+1) + '. ' + $st" x="8" y="4" fontSize="22" :color="$text" />
              </Element>
            </Element>
            <Text content="[Up/Down] Navigate" x="16" y="488" fontSize="18" :color="$muted" />
          </Element>

          <!-- Nutrition -->
          <Element x="1208" y="0" w="536" h="520" rect="true" :color="$surface" :alpha="1">
            <Text content="Nutrition" x="16" y="12" fontSize="28" :color="$text" />
            <Element x="16" y="56" w="504" h="440">
              <Badge :label="'Calories: ' + (($recipe?.nutrition?.calories) || '—')" />
              <Badge :label="'Carbs: ' + (($recipe?.nutrition?.carbs) || '—')" :x="260" />
              <Badge :label="'Protein: ' + (($recipe?.nutrition?.protein) || '—')" :y="48" />
              <Badge :label="'Fat: ' + (($recipe?.nutrition?.fat) || '—')" :x="260" :y="48" />
              <Badge :label="'Fiber: ' + (($recipe?.nutrition?.fiber) || '—')" :y="96" />
              <Badge :label="'Sugar: ' + (($recipe?.nutrition?.sugar) || '—')" :x="260" :y="96" />
            </Element>
          </Element>
        </Element>
      </Element>
    </Element>
  `,
})
