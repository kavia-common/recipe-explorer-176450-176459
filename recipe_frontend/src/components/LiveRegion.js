import Blits from '@lightningjs/blits'

/**
 * A lightweight ARIA live region announcer.
 * Use this.announce(message, { polite|assertive }) to notify screen readers about status changes.
 */
export default Blits.Component('LiveRegion', {
  state() {
    return {
      message: '',
      politeness: 'polite', // 'polite' | 'assertive'
      // internal toggle to force screen reader to re-announce same text
      _tick: false
    }
  },
  template: `
    <Element>
      <!-- Live Regions (polite and assertive). Hidden visually, read by SRs. -->
      <Text
        :content="$message"
        role="status"
        :aria-live="$politeness"
        :aria-atomic="true"
        class="sr-only"
        :alpha="0"
      />
    </Element>
  `,
  methods: {
    /**
     * PUBLIC_INTERFACE
     * Announce a message to assistive tech.
     * @param {string} msg - Message to announce
     * @param {{ politeness?: 'polite' | 'assertive' }} [opts]
     */
    announce(msg, opts = {}) {
      const tone = opts.politeness === 'assertive' ? 'assertive' : 'polite'
      // Toggle to force re-read when same message repeats
      this._tick = !this._tick
      this.politeness = tone
      this.message = `${msg}${this._tick ? '' : ' '}`
    }
  }
})
