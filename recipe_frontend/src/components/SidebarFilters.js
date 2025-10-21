import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { applyFilters } from '../state/actions.js'

/**
 * SidebarFilters
 * Shows current filters and allows cycling through demo filter options using remote keys.
 */
export default Blits.Component('SidebarFilters', {
  state() {
    return {
      cuisines: ['Italian', 'Mexican', 'Indian', 'Chinese', 'American', null],
      difficulties: ['Easy', 'Medium', 'Hard', null],
      cuisineIndex: 0,
      difficultyIndex: 0,
      maxTimeOptions: [null, 15, 30, 45, 60],
      maxTimeIndex: 0,
    }
  },

  template: `
    <Element w="420" h="940" color="0xFFFFFFFF">
      <Text content="Filters" x="10" y="10" color="0x111827FF" fontSize="28" />

      <Text :content="'Cuisine: ' + ($currentCuisine || 'Any')" x="10" y="60" fontSize="24" color="0x2563EBFF" />
      <Text :content="'Difficulty: ' + ($currentDifficulty || 'Any')" x="10" y="100" fontSize="24" color="0x2563EBFF" />
      <Text :content="'Max Time: ' + ($currentMaxTime === null ? 'Any' : ($currentMaxTime + ' min'))" x="10" y="140" fontSize="24" color="0x2563EBFF" />

      <Text content="Use Left/Right to cycle Cuisine" x="10" y="200" fontSize="20" color="0x111827FF" />
      <Text content="Use Up/Down to cycle Difficulty" x="10" y="230" fontSize="20" color="0x111827FF" />
      <Text content="Press Enter to cycle Max Time" x="10" y="260" fontSize="20" color="0x111827FF" />
    </Element>
  `,

  computed: {
    currentCuisine() {
      const c = this.cuisines[this.cuisineIndex] ?? null
      return c
    },
    currentDifficulty() {
      const d = this.difficulties[this.difficultyIndex] ?? null
      return d
    },
    currentMaxTime() {
      return this.maxTimeOptions[this.maxTimeIndex] ?? null
    },
  },

  methods: {
    updateFilters() {
      applyFilters({
        cuisine: this.currentCuisine,
        difficulty: this.currentDifficulty,
        maxTime: this.currentMaxTime,
      })
    },
  },

  mounted() {
    // initialize UI indices based on store
    const { cuisine, difficulty, maxTime } = store.state.filters
    const ci = this.cuisines.indexOf(cuisine)
    const di = this.difficulties.indexOf(difficulty)
    const ti = this.maxTimeOptions.indexOf(maxTime)
    if (ci >= 0) this.cuisineIndex = ci
    if (di >= 0) this.difficultyIndex = di
    if (ti >= 0) this.maxTimeIndex = ti
  },

  input: {
    left() {
      this.cuisineIndex = (this.cuisineIndex - 1 + this.cuisines.length) % this.cuisines.length
      this.updateFilters()
    },
    right() {
      this.cuisineIndex = (this.cuisineIndex + 1) % this.cuisines.length
      this.updateFilters()
    },
    up() {
      this.difficultyIndex = (this.difficultyIndex - 1 + this.difficulties.length) % this.difficulties.length
      this.updateFilters()
    },
    down() {
      this.difficultyIndex = (this.difficultyIndex + 1) % this.difficulties.length
      this.updateFilters()
    },
    enter() {
      this.maxTimeIndex = (this.maxTimeIndex + 1) % this.maxTimeOptions.length
      this.updateFilters()
    },
    back(e) {
      // bubble back if unhandled
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
