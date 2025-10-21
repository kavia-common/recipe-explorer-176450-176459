import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { applyFilters, setSort } from '../state/actions.js'
import { t } from '../plugins/i18n.js'

/**
 * SidebarFilters
 * Shows current filters and allows cycling through demo filter options using remote keys.
 * Adds ARIA roles/labels for better a11y.
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
      sortBy: ['rating', 'time', 'title'],
      sortIndex: 0,
      sortDir: ['desc', 'asc'],
      sortDirIndex: 0,
    }
  },

  template: `
    <Element w="420" h="940" color="0xFFFFFFFF" rect="true" role="complementary" aria-label="Filters panel">
      <Element x="10" y="10" role="button" :aria-label="$toggleLabel">
        <Text content="Filters" color="0x111827FF" fontSize="28" />
      </Element>

      <Text :content="'Cuisine: ' + ($currentCuisine || 'Any')" x="10" y="60" fontSize="24" color="0x2563EBFF" role="note" aria-label="Cuisine filter" />
      <Text :content="'Difficulty: ' + ($currentDifficulty || 'Any')" x="10" y="100" fontSize="24" color="0x2563EBFF" role="note" aria-label="Difficulty filter" />
      <Text :content="'Max Time: ' + ($currentMaxTime === null ? 'Any' : ($currentMaxTime + ' min'))" x="10" y="140" fontSize="24" color="0x2563EBFF" role="note" aria-label="Maximum time filter" />

      <Text content="Use Left/Right: Cuisine" x="10" y="200" fontSize="20" color="0x111827FF" />
      <Text content="Use Up/Down: Difficulty" x="10" y="230" fontSize="20" color="0x111827FF" />
      <Text content="Enter: Max Time" x="10" y="260" fontSize="20" color="0x111827FF" />

      <Element x="10" y="320" w="380" h="120" role="group" aria-label="Sort options">
        <Text content="Sort" fontSize="24" color="0x111827FF" />
        <Text :content="'By: ' + $currentSortBy" y="36" fontSize="22" color="0x2563EBFF" />
        <Text :content="'Direction: ' + $currentSortDir" y="68" fontSize="22" color="0x2563EBFF" />
        <Text content="[Blue] Cycle sort by   [Yellow] Toggle direction" y="96" fontSize="18" color="0x6B7280FF" />
      </Element>
    </Element>
  `,

  computed: {
    currentCuisine() { return this.cuisines[this.cuisineIndex] ?? null },
    currentDifficulty() { return this.difficulties[this.difficultyIndex] ?? null },
    currentMaxTime() { return this.maxTimeOptions[this.maxTimeIndex] ?? null },
    currentSortBy() { return this.sortBy[this.sortIndex] || 'rating' },
    currentSortDir() { return this.sortDir[this.sortDirIndex] || 'desc' },
    toggleLabel() { return t('a11y.filter.toggle', 'Toggle filter') },
  },

  methods: {
    updateFilters() {
      applyFilters({
        cuisine: this.currentCuisine,
        difficulty: this.currentDifficulty,
        maxTime: this.currentMaxTime,
      })
    },
    updateSort() {
      // map 'time' -> store's 'time' key
      setSort({ by: this.currentSortBy, direction: this.currentSortDir })
    }
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

    const sBy = store.state.sort.by
    const sDir = store.state.sort.direction
    const sbi = this.sortBy.indexOf(sBy)
    const sdi = this.sortDir.indexOf(sDir)
    if (sbi >= 0) this.sortIndex = sbi
    if (sdi >= 0) this.sortDirIndex = sdi
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
    blue() {
      // cycle sort by
      this.sortIndex = (this.sortIndex + 1) % this.sortBy.length
      this.updateSort()
    },
    yellow() {
      // toggle dir
      this.sortDirIndex = (this.sortDirIndex + 1) % this.sortDir.length
      this.updateSort()
    },
    back(e) {
      // bubble back if unhandled
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
