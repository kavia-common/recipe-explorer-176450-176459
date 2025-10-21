import Blits from '@lightningjs/blits'
import { listRecipes } from '../services/recipesService.js'
import RecipeCard from '../components/RecipeCard.js'
import Loader from '../components/Loader.js'
import Pagination from '../components/Pagination.js'
import SidebarFilters from '../components/SidebarFilters.js'
import SearchBar from '../components/SearchBar.js'

export default Blits.Component('RecipesList', {
  components: { RecipeCard, Loader, Pagination, SidebarFilters, SearchBar },
  state() {
    return {
      loading: true,
      items: [],
      total: 0,
      page: 1,
      pageSize: 9,
      sort: { by: 'rating', dir: 'desc' },
      query: '',
      filters: {}
    }
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const res = await listRecipes({
          query: this.query,
          filters: this.filters,
          sort: this.sort,
          page: this.page,
          pageSize: this.pageSize
        })
        this.items = res.items
        this.total = res.total
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async onSearch(q) {
      this.query = q || ''
      this.page = 1
      await this.load()
    },
    async onFilterChange(f) {
      this.filters = f || {}
      this.page = 1
      await this.load()
    },
    async onSortChange(s) {
      this.sort = s || { by: 'rating', dir: 'desc' }
      this.page = 1
      await this.load()
    },
    async onPageChange(p) {
      this.page = p
      await this.load()
    }
  },
  async onCreate() {
    await this.load()
  },
  template: `
    <Element w="1920" h="1080">
      <Text content="All Recipes" x="100" y="60" />
      <SearchBar x="100" y="100" @submit="$onSearch" />
      <SidebarFilters x="100" y="160" @change="$onFilterChange" />
      <Loader :visible="$loading" x="100" y="220" />
      <Element :alpha="$loading ? 0 : 1">
        <Element
          :for="(item, idx) in $items"
          :key="$item.id"
          :x="380 + ($idx % 3) * 420"
          :y="160 + Math.floor($idx / 3) * 320"
          w="400"
          h="300"
        >
          <RecipeCard :recipe="$item" />
        </Element>
      </Element>
      <Pagination
        :currentPage="$page"
        :pageSize="$pageSize"
        :total="$total"
        x="100"
        y="880"
        @change="$onPageChange"
      />
    </Element>
  `
})
