<template>
  <div id="detail">
    <!-- 导航 -->
    <detail-nav-bar class="detail-nav" />

    <scroll class="content" ref="scroll">
      <!-- 轮播 -->
      <detail-swiper :top-images="topImages" />

      <!-- 商品详情 -->
      <detail-base-info :goods="goods" />

      <!-- 店铺信息 -->
      <detail-shop-info :shop="shop" />

      <!-- 商品图片展示 -->
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad" />

      <!-- 参数信息 -->
      <detail-param-info :paramInfo="paramInfo" />
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'

import Scroll from 'components/common/scroll/Scroll'

import {getDetail, Goods, Shop, GoodsParam} from 'network/detail'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    Scroll
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {}
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
    })
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
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
  height: calc(100% - 44px);
}
</style>
