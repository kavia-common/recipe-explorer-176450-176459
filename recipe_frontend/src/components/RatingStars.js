import Blits from '@lightningjs/blits'

/**
 * RatingStars
 * Renders a 5-star rating visualization plus count.
 * Props:
 *  - value: number (0-5)
 *  - count: number of reviews
 */
export default Blits.Component('RatingStars', {
  props: ['value', 'count'],
  computed: {
    safeValue() { return Math.max(0, Math.min(5, Number(this.value || 0))) },
    fullStars() { return Math.floor(this.safeValue) },
    halfStar() { return this.safeValue - Math.floor(this.safeValue) >= 0.5 },
    emptyStars() { return 5 - this.fullStars - (this.halfStar ? 1 : 0) },
    label() {
      const v = this.safeValue.toFixed(1)
      const c = Number(this.count || 0)
      return `Rating: ${v} (${c})`
    }
  },
  template: `
    <Element w="300" h="28" color="0x00000000">
      <!-- Accessible label -->
      <Text :content="$label" x="0" y="-4" fontSize="18" color="0x6B7280FF" />
      <!-- Stars row -->
      <Element x="140" y="-2" w="160" h="28">
        <Text :for="(i, idx) in (new Array($fullStars).fill(0))" :key="$idx" :x="$idx * 28" content="★" fontSize="22" color="0xF59E0BFF" />
        <Text :alpha="$halfStar ? 1 : 0" :x="$fullStars * 28" content="☆" fontSize="22" color="0xF59E0BFF" />
        <Text :for="(i, j) in (new Array($emptyStars).fill(0))" :key="'e'+$j" :x="($fullStars + ($halfStar?1:0) + $j) * 28" content="☆" fontSize="22" color="0x9CA3AFFF" />
      </Element>
    </Element>
  `
})
