<template>
  <div id="home">
    <!-- 顶部导航 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" 
    ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true"
    @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banners" />

      <!-- 推荐 -->
      <recommend-view :recommends="recommends" />

      <!-- 特色 -->
      <feature-view />

      <!-- tab -->
      <tab-control class="tab-control" 
      :titles="['流行','新款','精选']"
      @tabClick="tabClick" />

      <!-- 商品列表 -->
      <good-list  :goods="showGoods"/>
    </scroll>

    <!-- 回到顶部 -->
    <!-- 监听组件根元素的原生事件 .native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata, getHomeGoods} from 'network/home'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page:0, list: []},
        'new': {page:0, list: []},
        'sell': {page:0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    // 请求多个数据
    this.getHomeMultidata()

    /* 请求商品数据 */
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    /* 监听 goodsListItem 中图片加载完成 */
    this.$bus.$on('itemImageLoad', () => {
      console.log('图片加载完成')
      this.$refs.scroll && this.$refs.scroll.refresh()
    })
  },
  methods: {
    /* 事件监听 */
    /* tab 分类选项 */
    tabClick(index) {
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
    },
    /* 回到顶部 */
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      this.isShowBackTop = (-position.y) > 1000
    },
    /* 加载更多 */
    loadMore() {
      /* console.log('上拉加载更多') */
      this.getHomeGoods(this.currentType)

      /* 图片加载完毕，BScroll重新计算高度 */
      this.$refs.scroll.scroll.refresh()
    },

    /* 网路请求 */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
    }
  }
}
</script>

<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  background-color: #fff;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
}

</style>