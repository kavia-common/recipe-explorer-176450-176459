import Blits from '@lightningjs/blits'
import store from '../state/store.js'
import { setPage } from '../state/actions.js'

export default Blits.Component('Pagination', {
  template: `
    <Element w="1380" h="60" color="0xFFFFFFFF" rect="true">
      <Text :content="$label" x="10" y="8" color="0x111827FF" fontSize="24" />
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
    }
  },

  input: {
    left() {
      if (!store.state.pagination.total) return
      const p = Math.max(1, store.state.pagination.page - 1)
      setPage(p)
    },
    right() {
      if (!store.state.pagination.total) return
      const tp = Math.max(1, Math.ceil(store.state.pagination.total / store.state.pagination.pageSize))
      const p = Math.min(tp, store.state.pagination.page + 1)
      setPage(p)
    },
    back(e) {
      this.parent && this.parent.focus && this.parent.focus(e)
    },
  },
})
