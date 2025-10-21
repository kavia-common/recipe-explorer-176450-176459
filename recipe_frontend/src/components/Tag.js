import Blits from '@lightningjs/blits'

/**
 * Tag Component - Placeholder
 * Displays a minimal tag pill.
 */
export default Blits.Component('Tag', {
  props: ['text'],
  template: `
    <Element w="140" h="36" color="0xffF59E0B" rect="true" alpha="0.9">
      <Text x="12" y="6" :content="$text || 'Tag'" fontSize="20" textColor="0xff111827" />
    </Element>
  `
})
