import Blits from '@lightningjs/blits'

/**
 * RecipeCard Component - Placeholder
 * Displays a card-like container with a title.
 */
export default Blits.Component('RecipeCard', {
  props: ['title'],
  template: `
    <Element w="420" h="260" color="0xffffffff" alpha="1" rect="true">
      <Element x="0" y="0" w="420" h="260" color="0xffe5e7eb" rect="true" alpha="0.35" />
      <Text x="24" y="24" :content="$title || 'Recipe Card'" fontSize="32" textColor="0xff111827" />
    </Element>
  `
})
