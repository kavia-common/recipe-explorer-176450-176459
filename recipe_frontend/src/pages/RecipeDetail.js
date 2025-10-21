import Blits from '@lightningjs/blits'

/**
 * RecipeDetail Page - Placeholder
 * Displays a simple text to confirm the page is wired later.
 */
export default Blits.Component('RecipeDetail', {
  props: ['id'],
  template: `
    <Element w="1920" h="1080" color="0x00000000">
      <Text x="96" y="96" :content="'Recipe Detail (placeholder) ID: ' + ($id || 'N/A')" fontSize="44" textColor="0xff111827" />
    </Element>
  `,
  // PUBLIC_INTERFACE
  methods: {
    /** Placeholder public method for future integration. */
    load() {
      // no-op
    }
  }
})
