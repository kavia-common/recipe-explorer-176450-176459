import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { setPage } from '../state/actions.js'
import { t } from '../plugins/i18n.js'

export default Blits.Component('Pagination', {
  template: `
    <Element w="1380" h="60" color="0xFFFFFFFF" rect="true" role="navigation" aria-label="Pagination">
      <Element x="10" y="8" role="button" :aria-label="$prevLabel" @enter="$prev">
        <Text content="Prev" fontSize="24" color="0x111827FF" />
      </Element>
      <Text :content="$label" x="120" y="8" color="0x111827FF" fontSize="24" role="status" aria-live="polite" aria-atomic="true" />
      <Element x="360" y="8" role="button" :aria-label="$nextLabel" @enter="$next">
        <Text content="Next" fontSize="24" color="0x111827FF" />
      </Element>
      <Text content="[Left] Prev  [Right] Next" x="10" y="34" color="0x2563EBFF" fontSize="20" />
    </Element>
  `,

  computed: {
    page() { return store.state.pagination.page },
    pageSize() { return store.state.pagination.pageSize },
    total() { return store.state.pagination.total },
    totalPages() { return Math.max(1, Math.ceil(this.total / this.pageSize)) },
    label() {
      if (!this.total) return 'No results'
      return `Page ${this.page} / ${this.totalPages}   •   Total: ${this.total}`
    },
    prevLabel() { return t('a11y.pagination.prev', 'Previous page') },
    nextLabel() { return t('a11y.pagination.next', 'Next page') },
  },

  methods: {
    // PUBLIC_INTERFACE
    /** Go to previous page */
    $prev() {
      if (!store.state.pagination.total) return
      const p = Math.max(1, store.state.pagination.page - 1)
      setPage(p)
    },
    // PUBLIC_INTERFACE
    /** Go to next page */
    $next() {
      if (!store.state.pagination.total) return
      const tp = Math.max(1, Math.ceil(store.state.pagination.total / store.state.pagination.pageSize))
      const p = Math.min(tp, store.state.pagination.page + 1)
      setPage(p)
    }
  },

  input: {
    left() { this.$prev() },
    right() { this.$next() },
    enter() { this.$next() },
    back(e) {
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
