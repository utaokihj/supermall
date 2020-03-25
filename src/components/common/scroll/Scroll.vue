<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      dafault: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
    }
  },
  mounted() {
    /* 创建 BScroll 对象 */
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })

    /* 监听滚动位置 */
    this.scroll.on('scroll', (position) => {
      /* console.log(position) */
      this.$emit('scroll', position)
    })

    /* 监听上拉事件 */
    this.scroll.on('pullingUp', () => {
      /* console.log('上拉加载更多') */
      this.$emit('pullingUp')
    })
  },
  methods: {
    /* 回到顶部 */
    scrollTo(x, y, time = 500) {
      this.scroll &&  this.scroll.scrollTo(x, y, time)
    },

    /* 上拉加载更多的刷新 */
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style scoped>

</style>
