import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { setQuery } from '../state/actions.js'
import { t } from '../plugins/i18n.js'

/**
 * SearchBar with a11y roles and labels.
 * Uses left/right to cycle samples, Enter commits query.
 */
export default Blits.Component('SearchBar', {
  props: ['placeholder'],
  state() {
    return {
      query: store.state.query || '',
      samples: ['', 'chicken', 'pasta', 'salad', 'soup'],
      sampleIndex: 0,
      resultsId: 'recipes-results'
    }
  },

  template: `
    <Element w="1380" h="80" color="0xFFFFFFFF" rect="true" role="search" :aria-label="$ariaSearch">
      <Text :content="$srLabel" class="visually-hidden" />
      <Text :content="'Search: ' + ($query || $placeholder || '')" x="10" y="10" color="0x111827FF" fontSize="28" role="textbox" :aria-controls="$resultsId" :aria-label="$ariaSearch" />
      <Text content="[Left/Right] samples  [Enter] search" x="10" y="48" color="0x6B7280FF" fontSize="20" />
      <!-- Clear button area (keyboard enter triggers clear) -->
      <Element x="1320" y="16" w="48" h="48" role="button" :aria-label="$ariaClear" @enter="$clear">
        <Text content="✕" x="14" y="8" fontSize="24" />
      </Element>
    </Element>
  `,

  computed: {
    ariaSearch() { return t('a11y.search', 'Search recipes') },
    ariaClear() { return t('a11y.search_clear', 'Clear search query') },
    srLabel() { return this.ariaSearch },
  },

  watch: {
    // Sync local when global query changes (e.g., from TopNav)
    '$store.query': {
      immediate: true,
      handler() {
        this.query = store.state.query || ''
      }
    }
  },

  methods: {
    // PUBLIC_INTERFACE
    /** Commit query to global store and announce */
    commit() {
      setQuery(this.query)
      this.$announce && this.$announce(t('a11y.search', 'Search recipes'))
    },
    // PUBLIC_INTERFACE
    /** Clear the current query and announce */
    $clear() {
      this.query = ''
      setQuery('')
      this.$announce && this.$announce(t('a11y.search_clear', 'Clear search query'))
    },
  },

  input: {
    left() {
      this.sampleIndex = (this.sampleIndex - 1 + this.samples.length) % this.samples.length
      this.query = this.samples[this.sampleIndex]
    },
    right() {
      this.sampleIndex = (this.sampleIndex + 1) % this.samples.length
      this.query = this.samples[this.sampleIndex]
    },
    enter() {
      this.commit()
    },
    back(e) {
      // bubble unhandled
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },

  provide() {
    // Bridge to page-level LiveRegion if present
    return {
      $announce: (msg) => {
        const app = this.app
        // traverse into current routed view to find live region
        const view = app && app.$children && app.$children.find && app.$children.find(c => !!c.$refs?.liveRegion)
        if (view && view.$refs && view.$refs.liveRegion && view.$refs.liveRegion.announce) {
          view.$refs.liveRegion.announce(msg, { politeness: 'polite' })
        }
      }
    }
  }
})
