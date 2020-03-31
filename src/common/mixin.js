import {debouce} from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    console.log('我是mixin中的内容')
    let newRefresh = debouce(this.$refs.scroll.refresh, 200)
    this.itemImgListener = () => {
      newRefresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    /* 回到顶部 */
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    }
  }
}