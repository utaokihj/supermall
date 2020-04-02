<template>
  <div id="detail">
    <!-- 导航 -->
    <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick" />

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 轮播 -->
      <detail-swiper :top-images="topImages" />

      <!-- 商品详情 -->
      <detail-base-info :goods="goods" />

      <!-- 店铺信息 -->
      <detail-shop-info :shop="shop" />

      <!-- 商品图片展示 -->
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad" />

      <!-- 参数信息 -->
      <detail-param-info ref="params" :paramInfo="paramInfo" />

      <!-- 评论信息 -->
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />

      <!-- 推荐 -->
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>

    <detail-bottom-bar @addCart="addToCart" />

    <!-- 回到顶部 -->
    <!-- 监听组件根元素的原生事件 .native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <toast :message="message" :show="show" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import Toast from 'components/common/toast/Toast'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import {debouce} from 'common/utils'
import {BACKTOP_DISTANCE} from 'common/const'

import {mapActions} from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      message: '',
      show: false
    }
  },
  created() {
    /* 保存传入的 iid */
    console.log(this.$route.params)
    this.iid = this.$route.params.iid

    /* 根据 iid 请求详情数据 */
    getDetail(this.iid).then(res => {
      /* console.log(res) */
      const data = res.result
      /* 获取顶部图片轮播数据 */
      this.topImages = data.itemInfo.topImages

      /* 获取商品信息 */
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      /* 创建店铺信息 */
      this.shop = new Shop(data.shopInfo)

      /* 商品详情 */
      this.detailInfo = data.detailInfo

      /* 参数信息 */
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      /* 评论信息 */
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      /* 推荐数据 */
      getRecommend().then(res => {
        /* console.log(res) */
        this.recommends = res.data.list
      })

      /* 给 getThemeTopY 赋值，并防抖 */
      this.getThemeTopY = debouce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs)
      }, 100)
    })
  },
  destoryed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()

      this.getThemeTopY()
    },
    titleClick(index) {
      /* console.log(index) */
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      /* 获取 y 值 */
      const positionY = -position.y

      /* positionY 和主题中值进行对比 */
      let length = this.themeTopYs.length
      for(let i = 0; i < length-1; i++) {
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      /* 判断 backTop 是否显示 */
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE
    },
    addToCart() {
      /* 获取购物车需要展示的信息 */
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      /* 将商品添加到购物车 */
      /* this.$store.dispatch('addCart', product).then(res => {
        console.log(res)
      }) */
      this.addCart(product).then(res => {
        /* this.show = true;
        this.message = res

        setTimeout(() => {
          this.show = false;
          this.message = ''
        }, 2000) */
        this.$toast.show(res, 2000)
      })
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 55px);
}
</style>
