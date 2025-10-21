import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { loadRecipes, setPage } from '../state/actions.js'
import SidebarFilters from '../components/SidebarFilters.js'
import SearchBar from '../components/SearchBar.js'
import RecipeCard from '../components/RecipeCard.js'
import Pagination from '../components/Pagination.js'
import Loader from '../components/Loader.js'
import LiveRegion from '../components/LiveRegion.js'
import { t } from '../plugins/i18n.js'

export default Blits.Component('RecipesList', {
  components: { SidebarFilters, SearchBar, RecipeCard, Pagination, Loader, LiveRegion },

  state() {
    return {
      gridCols: 3, // number of columns for cards
      gutter: 20,
      cardW: 400,
      cardH: 240,
      focusIndex: 0,
    }
  },

  template: `
    <Element w="1920" h="980" x="0" y="100" color="0x00000000">
      <!-- Sidebar -->
      <Element x="40" y="20" w="420" h="940">
        <SidebarFilters />
      </Element>

      <!-- Main content landmark with ref for skip link -->
      <Element x="500" y="20" w="1380" h="940" role="main" aria-label="Recipes" ref="mainContent">
        <!-- Search Row -->
        <Element x="0" y="0" w="1380" h="80">
          <SearchBar />
        </Element>

        <!-- Loading / Error -->
        <Element x="0" y="90" w="1380" h="60" :alpha="$error ? 1 : 0">
          <Text :content="$error" w="1200" h="60" fontSize="28" color="0xEF4444FF" />
        </Element>
        <Element x="0" y="90" w="1380" h="60" :alpha="$loading ? 1 : 0" role="status" aria-live="polite" aria-atomic="true">
          <Loader />
        </Element>

        <!-- Grid of recipes -->
        <Element x="0" :y="$loading || $error ? 160 : 100" w="1380" h="760" role="region" aria-label="Search results" id="recipes-results">
          <Element
            :for="(item, index) in $pageItems"
            :key="$item.id"
            :x="($index % $gridCols) * (($cardW + $gutter))"
            :y="Math.floor($index / $gridCols) * ($cardH + $gutter)"
            :w="$cardW"
            :h="$cardH"
          >
            <RecipeCard :recipe="$item" :alpha="$isFocused($index) ? 1 : 0.96" :scale="$isFocused($index) ? 1.02 : 1" />
          </Element>
        </Element>

        <!-- Pagination -->
        <Element x="0" y="880" w="1380" h="60">
          <Pagination />
        </Element>

        <!-- Live region for announcements -->
        <LiveRegion ref="liveRegion" />
      </Element>
    </Element>
  `,

  computed: {
    pageItems() {
      const { filtered, pagination } = store.state
      const start = (pagination.page - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      return filtered.slice(start, end)
    },
    loading() {
      return store.state.loading
    },
    error() {
      return store.state.error
    },
    totalOnPage() {
      return this.pageItems.length
    }
  },

  methods: {
    // PUBLIC_INTERFACE
    /** Whether index is currently focused for visual cues. */
    $isFocused(i) {
      return this.focusIndex === i
    },
    // PUBLIC_INTERFACE
    /** Move focus in grid by delta, clamped to items on current page. */
    moveFocus(delta) {
      const max = Math.max(0, this.totalOnPage - 1)
      this.focusIndex = Math.max(0, Math.min(max, this.focusIndex + delta))
    },
    // PUBLIC_INTERFACE
    /** Move focus up/down a row (gridCols). */
    moveRow(deltaRows) {
      this.moveFocus(deltaRows * this.gridCols)
    },
    // PUBLIC_INTERFACE
    /** Announce via page LiveRegion if available */
    $announce(msg, tone = 'polite') {
      if (this.$refs && this.$refs.liveRegion && this.$refs.liveRegion.announce) {
        this.$refs.liveRegion.announce(msg, { politeness: tone })
      }
    }
  },

  watch: {
    loading(v) {
      if (v) this.$announce(t('a11y.loading', 'Loading'))
      else this.$announce(t('a11y.loaded', 'Loaded'))
    }
  },

  async mounted() {
    // Ensure favorites in memory then load recipes if not loaded
    store.hydrateFavorites()
    if (!store.state.recipes || store.state.recipes.length === 0) {
      this.$announce(t('a11y.loading', 'Loading'))
      await loadRecipes()
      this.$announce(t('a11y.loaded', 'Loaded'))
    } else {
      // recompute filtered from existing recipes
      store.setRecipes(store.state.recipes)
    }
    // clamp page
    if (store.state.pagination.page < 1) setPage(1)
    this.focusIndex = 0
  },
})
