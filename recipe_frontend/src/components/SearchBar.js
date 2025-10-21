import Blits from '@lightningjs/blits'
import { setQuery } from '../state/actions.js'

/**
 * SearchBar
 * Simple search field emulation for TV remote: cycles a preset query on Enter.
 */
export default Blits.Component('SearchBar', {
  state() {
    return {
      query: '',
      samples: ['', 'chicken', 'pasta', 'salad', 'soup'],
      sampleIndex: 0,
    }
  },

  template: `
    <Element w="1380" h="80" color="0xFFFFFFFF">
      <Text :content="'Search: ' + $query" x="10" y="10" color="0x111827FF" fontSize="28" />
      <Text content="Press Enter to cycle preset search terms" x="10" y="48" color="0x6B7280FF" fontSize="20" />
    </Element>
  `,

  methods: {
    commit() {
      setQuery(this.query)
    },
  },

  input: {
    enter() {
      this.sampleIndex = (this.sampleIndex + 1) % this.samples.length
      this.query = this.samples[this.sampleIndex]
      this.commit()
    },
    back(e) {
      // bubble unhandled
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
