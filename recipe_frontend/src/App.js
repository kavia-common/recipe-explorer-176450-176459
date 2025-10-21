import Blits from '@lightningjs/blits'
import Router from './router/index.js'
import theme from './styles/theme.js'
import TopNav from './components/TopNav.js'

/**
 * Root Application with Ocean Professional theme background and surface layering.
 * Routing remains unchanged; we wrap RouterView with a "surface" container.
 */
export default Blits.Application({
  components: { TopNav },
  template: `
    <Element w="1920" h="1080">
      <!-- Background layer (solid matching tokens.background; gradient handled via CSS body as needed) -->
      <Element w="1920" h="1080" color="0xfff9fafb" rect="true" />

      <!-- Top Navigation -->
      <TopNav />

      <!-- Surface container (white surface) -->
      <Element x="48" y="120" w="1824" h="912" color="0xffffffff" rect="true">
        <RouterView />
      </Element>
    </Element>
  `,
  routes: Router,
})
