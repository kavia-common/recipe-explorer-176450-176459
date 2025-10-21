import Blits from '@lightningjs/blits'

/**
 * TopNav Component - Placeholder
 * Shows a simple top navigation bar area.
 */
export default Blits.Component('TopNav', {
  template: `
    <Element w="1920" h="96" color="0xffffffff" rect="true">
      <Element x="0" y="0" w="1920" h="96" color="0xff2563EB" rect="true" alpha="0.9" />
      <Text x="32" y="28" content="Recipe Explorer (placeholder)" fontSize="36" textColor="0xffffffff" />
    </Element>
  `
})
