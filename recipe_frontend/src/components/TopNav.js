import Blits from '@lightningjs/blits'
import SearchBar from './SearchBar.js'

/**
 * Top navigation bar for the Recipe Explorer.
 * - Keyboard navigation (left/right/enter/back)
 * - Deep links via RouterLink to '/', '/search'
 * - Integrates SearchBar placeholder (non-functional for now)
 */
export default Blits.Component('TopNav', {
  components: { SearchBar },
  state() {
    return {
      title: 'Recipe Explorer',
      focusIndex: 0, // 0: Home, 1: Search
      items: [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'search', label: 'Search', path: '/search' }
      ]
    }
  },
  template: `
    <Element w="1920" h="96" :color="$barColor" rect="true">
      <!-- Brand -->
      <Text x="60" y="28" :content="$title" fontSize="36" :textColor="$titleColor" />

      <!-- Nav buttons -->
      <Element x="360" y="24" w="420" h="48">
        <RouterLink
          :for="(item, index) in $items"
          :key="$item.id"
          :to="$item.path"
        >
          <Element
            :x="$index * 210"
            y="0"
            w="200"
            h="48"
            :color="$isFocused($index) ? $primary : 0x00111827"
            rect="true"
            :alpha="$isFocused($index) ? 1 : 0.6"
          >
            <Text x="20" y="10" :content="$item.label" fontSize="26" :textColor="$isFocused($index) ? 0xffffffff : 0xffe5e7eb" />
          </Element>
        </RouterLink>
      </Element>

      <!-- SearchBar placeholder on the right -->
      <Element :x="$searchX" y="20" w="620" h="56">
        <SearchBar placeholder="Search recipes (placeholder)" />
      </Element>
    </Element>
  `,
  computed: {
    barColor() { return 0xff111827 },
    titleColor() { return 0xffffffff },
    primary() { return 0xff2563eb },
    searchX() { return 1920 - 620 - 40 },
  },
  methods: {
    // PUBLIC_INTERFACE
    /** Returns true if the given index is focused (for visual highlight). */
    $isFocused(index) {
      return this.focusIndex === index
    },
    /** Move focus to a given index within range. */
    setFocusIndex(index) {
      const max = this.items.length - 1
      this.focusIndex = Math.max(0, Math.min(index, max))
    },
    /** Navigate to the route of the active nav item. */
    goActive() {
      const active = this.items[this.focusIndex]
      if (active && this.$router) {
        this.$router.to(active.path)
      }
    }
  },
  input: {
    left() { this.setFocusIndex(this.focusIndex - 1) },
    right() { this.setFocusIndex(this.focusIndex + 1) },
    enter() { this.goActive() },
    back(e) {
      // Bubble up so pages can handle back if needed
      if (this.parent && typeof this.parent.focus === 'function') {
        this.parent.focus(e)
      }
    }
  }
})
