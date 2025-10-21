import Blits from '@lightningjs/blits'
import routes from './router/index.js'
import TopNav from './components/TopNav.js'

/**
 * Root Application
 * - Sets background and a surface container
 * - Renders TopNav and RouterView
 * - Registers routes for '/', '/recipe/:id', optional '/search', and 404 fallback
 */
export default Blits.Application({
  components: { TopNav },
  template: `
    <Element w="1920" h="1080">
      <!-- Background layer -->
      <Element w="1920" h="1080" color="0xfff9fafb" rect="true" />

      <!-- Top Navigation -->
      <TopNav />

      <!-- Surface container (content area) -->
      <Element x="48" y="120" w="1824" h="912" color="0xffffffff" rect="true">
        <RouterView />
      </Element>
    </Element>
  `,
  routes
})
