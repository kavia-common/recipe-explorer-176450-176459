import Blits from '@lightningjs/blits'

/**
 * RatingStars Component - Placeholder
 * Displays a simple rating text (not graphical stars yet).
 */
export default Blits.Component('RatingStars', {
  props: ['value', 'count'],
  template: `
    <Element w="220" h="40" color="0x00000000">
      <Text x="0" y="0" :content="'Rating: ' + (($value || 0).toFixed ? ($value || 0).toFixed(1) : ($value || 0)) + ' (' + ($count || 0) + ')'" fontSize="22" textColor="0xff111827" />
    </Element>
  `
})
