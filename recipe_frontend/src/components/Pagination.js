import Blits from '@lightningjs/blits'

/**
 * Pagination Component - Placeholder
 * Displays a minimal pagination text.
 */
export default Blits.Component('Pagination', {
  props: ['page', 'totalPages'],
  template: `
    <Element w="260" h="40" color="0x00000000">
      <Text x="0" y="0" :content="'Page ' + ($page || 1) + ' / ' + ($totalPages || 1)" fontSize="22" textColor="0xff111827" />
    </Element>
  `
})
