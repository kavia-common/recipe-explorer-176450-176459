import Blits from '@lightningjs/blits'
import theme from '../styles/theme.js'

/**
 * Top navigation bar using Ocean Professional theme tokens.
 * Includes a visually hidden "Skip to content" placeholder link for accessibility.
 */
export default Blits.Component('TopNav', {
  state() {
    return {
      title: 'Recipe Explorer',
    }
  },
  template: `
    <Element w="1920" h="96" :color="$barColor" rect="true">
      <!-- Skip link placeholder (non-interactive for now, will wire in a11y step) -->
      <Element x="16" y="8" w="1" h="1" alpha="0">
        <Text content="Skip to content" />
      </Element>

      <!-- Brand -->
      <Text x="60" y="28" :content="$title" fontSize="36" :textColor="$titleColor" />

      <!-- Simple right-side action placeholder -->
      <Element :x="$rightX" y="24" w="200" h="48" :color="$buttonBg" rect="true" :alpha="$buttonAlpha">
        <Text x="16" y="10" content="Browse" textColor="0xffffffff" />
      </Element>
    </Element>
  `,
  computed: {
    barColor() {
      // Dark bar for contrast using theme text depth
      return 0xff111827
    },
    titleColor() {
      return 0xffffffff
    },
    rightX() {
      return 1920 - 200 - 40
    },
    buttonBg() {
      // Use primary color
      return 0xff2563eb
    },
    buttonAlpha() {
      return 1
    },
  },
})
