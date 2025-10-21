import Blits from '@lightningjs/blits'

/**
 * SidebarFilters Component - Placeholder
 * Shows a simple vertical block indicating filter area.
 */
export default Blits.Component('SidebarFilters', {
  template: `
    <Element w="320" h="800" color="0xffffffff" rect="true">
      <Element x="0" y="0" w="320" h="800" color="0xfff3f4f6" rect="true" />
      <Text x="20" y="20" content="Filters (placeholder)" fontSize="28" textColor="0xff111827" />
    </Element>
  `
})
