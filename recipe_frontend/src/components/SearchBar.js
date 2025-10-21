import Blits from '@lightningjs/blits'

/**
 * SearchBar Component - Placeholder
 * Non-interactive visual placeholder for a search field.
 */
export default Blits.Component('SearchBar', {
  props: ['placeholder'],
  template: `
    <Element w="600" h="56" color="0xffffffff" rect="true">
      <Element x="0" y="0" w="600" h="56" color="0xffe5e7eb" rect="true" />
      <Text x="20" y="14" :content="$placeholder || 'Search recipes... (placeholder)'" fontSize="26" textColor="0xff6b7280" />
    </Element>
  `
})
