import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { loadRecipes, setPage } from '../state/actions.js'
import SidebarFilters from '../components/SidebarFilters.js'
import SearchBar from '../components/SearchBar.js'
import RecipeCard from '../components/RecipeCard.js'
import Pagination from '../components/Pagination.js'
import Loader from '../components/Loader.js'

export default Blits.Component('RecipesList', {
  components: { SidebarFilters, SearchBar, RecipeCard, Pagination, Loader },

  state() {
    return {
      gridCols: 3, // number of columns for cards
      gutter: 20,
      cardW: 400,
      cardH: 240,
    }
  },

  template: `
    <Element w="1920" h="980" x="0" y="100" color="0x00000000">
      <!-- Sidebar -->
      <Element x="40" y="20" w="420" h="940">
        <SidebarFilters />
      </Element>

      <!-- Main content -->
      <Element x="500" y="20" w="1380" h="940">
        <!-- Search Row -->
        <Element x="0" y="0" w="1380" h="80">
          <SearchBar />
        </Element>

        <!-- Loading / Error -->
        <Element x="0" y="90" w="1380" h="60" :alpha="$error ? 1 : 0">
          <Text :content="$error" w="1200" h="60" fontSize="28" color="0xEF4444FF" />
        </Element>
        <Element x="0" y="90" w="1380" h="60" :alpha="$loading ? 1 : 0">
          <Loader />
        </Element>

        <!-- Grid of recipes -->
        <Element x="0" :y="$loading || $error ? 160 : 100" w="1380" h="760">
          <Element
            :for="(item, index) in $pageItems"
            :key="$item.id"
            :x="($index % $gridCols) * (($cardW + $gutter))"
            :y="Math.floor($index / $gridCols) * ($cardH + $gutter)"
            :w="$cardW"
            :h="$cardH"
          >
            <RecipeCard :recipe="$item" />
          </Element>
        </Element>

        <!-- Pagination -->
        <Element x="0" y="880" w="1380" h="60">
          <Pagination />
        </Element>
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
  },

  async mounted() {
    // Ensure favorites in memory then load recipes if not loaded
    store.hydrateFavorites()
    if (!store.state.recipes || store.state.recipes.length === 0) {
      await loadRecipes()
    } else {
      // recompute filtered from existing recipes
      store.setRecipes(store.state.recipes)
    }
    // clamp page
    if (store.state.pagination.page < 1) setPage(1)
  },
})
