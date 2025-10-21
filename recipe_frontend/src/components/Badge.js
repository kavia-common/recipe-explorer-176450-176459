import Blits from '@lightningjs/blits'

/**
 * Badge
 * Simple pill with dynamic width based on label length.
 */
export default Blits.Component('Badge', {
  props: ['label', 'color'],
  computed: {
    bg() { return this.color || 0x2563EBFF },
    text() { return String(this.label || 'Badge') },
    width() { return Math.min(220, Math.max(100, 24 + this.text.length * 10)) }
  },
  template: `
    <Element :w="$width" h="36" :color="$bg" rect="true" alpha="0.92">
      <Text x="14" y="6" :content="$text" fontSize="20" textColor="0xffffffff" />
    </Element>
  `
})
