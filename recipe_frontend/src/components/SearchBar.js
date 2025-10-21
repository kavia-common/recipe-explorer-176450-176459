import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { setQuery } from '../state/actions.js'

/**
 * SearchBar
 * Simple search emulation for remote: use preset samples with left/right, Enter commits.
 */
export default Blits.Component('SearchBar', {
  props: ['placeholder'],
  state() {
    return {
      query: store.state.query || '',
      samples: ['', 'chicken', 'pasta', 'salad', 'soup'],
      sampleIndex: 0,
    }
  },

  template: `
    <Element w="1380" h="80" color="0xFFFFFFFF" rect="true">
      <Text :content="'Search: ' + ($query || $placeholder || '')" x="10" y="10" color="0x111827FF" fontSize="28" />
      <Text content="[Left/Right] samples  [Enter] search" x="10" y="48" color="0x6B7280FF" fontSize="20" />
    </Element>
  `,

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
    commit() {
      setQuery(this.query)
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
})
