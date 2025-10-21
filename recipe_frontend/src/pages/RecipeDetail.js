import Blits from '@lightningjs/blits'
import { getRecipeById } from '../services/recipesService.js'
import Loader from '../components/Loader.js'
import RatingStars from '../components/RatingStars.js'
import Badge from '../components/Badge.js'
import Tag from '../components/Tag.js'

export default Blits.Component('RecipeDetail', {
  components: { Loader, RatingStars, Badge, Tag },
  props: ['id'],
  state() {
    return {
      loading: true,
      recipe: null
    }
  },
  async onCreate() {
    try {
      this.recipe = await getRecipeById(this.id)
    } finally {
      this.loading = false
    }
  },
  template: `
    <Element w="1920" h="1080">
      <Loader :visible="$loading" x="100" y="100" />
      <Element :alpha="$loading ? 0 : 1">
        <Text :content="$recipe ? $recipe.title : 'Recipe not found'" x="100" y="60" />
        <RatingStars :rating="$recipe?.rating || 0" x="100" y="110" />
        <Element x="100" y="150">
          <Badge :label="'Cook: ' + ($recipe?.cookTime || 0) + 'm'" />
          <Badge :label="'Servings: ' + ($recipe?.servings || 0)" :x="220" />
          <Badge :label="'Difficulty: ' + ($recipe?.difficulty || '—')" :x="430" />
        </Element>
        <Element x="100" y="200">
          <Text content="Tags:" />
          <Element :x="80">
            <Element :for="(t, i) in $recipe?.tags || []" :key="$t" :x="($i%6)*140" :y="Math.floor($i/6)*60">
              <Tag :label="$t" />
            </Element>
          </Element>
        </Element>
        <Element x="100" y="280">
          <Text content="Ingredients" />
          <Element :y="40">
            <Text :for="(ing, idx) in $recipe?.ingredients || []" :key="$idx" :y="$idx * 28" :content="'• ' + $ing" />
          </Element>
        </Element>
        <Element x="700" y="280">
          <Text content="Steps" />
          <Element :y="40">
            <Text :for="(st, idx) in $recipe?.steps || []" :key="$idx" :y="$idx * 28" :content="($idx+1) + '. ' + $st" />
          </Element>
        </Element>
      </Element>
    </Element>
  `
})
