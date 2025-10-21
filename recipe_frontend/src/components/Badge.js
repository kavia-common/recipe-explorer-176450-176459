import Blits from '@lightningjs/blits'

/**
 * Badge Component - Placeholder
 * Displays a small labeled pill.
 */
export default Blits.Component('Badge', {
  props: ['label', 'color'],
  template: `
    <Element w="160" h="40" :color="$color || 0xff2563EB" rect="true" alpha="0.9">
      <Text x="16" y="8" :content="$label || 'Badge'" fontSize="22" textColor="0xffffffff" />
    </Element>
  `
})
