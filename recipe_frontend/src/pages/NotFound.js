import Blits from '@lightningjs/blits'

/**
 * NotFound Page - Placeholder
 * Displays a simple not found message.
 */
export default Blits.Component('NotFound', {
  template: `
    <Element w="1920" h="1080" color="0x00000000">
      <Text x="96" y="96" content="404 - Page Not Found (placeholder)" fontSize="44" textColor="0xffEF4444" />
    </Element>
  `
})
