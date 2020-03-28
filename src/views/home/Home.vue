<template>
  <div id="home">
    <!-- 顶部导航 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control class="tab-control" 
                  :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl1"
                  v-show="isTabFixed" />

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />

      <!-- 推荐 -->
      <recommend-view :recommends="recommends" />

      <!-- 特色 -->
      <feature-view />

      <!-- tab -->
      <tab-control :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl2" />

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
import {debounce} from 'common/utils'

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
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactived() {
    this.saveY = this.$refs.scroll.getScrollY()
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
    /* 监听 goodsListItem 图片加载完成的事件监听 */
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    this.$bus.$on('itemImageLoad', () => {
      /* this.$refs.scroll.refresh() */
      refresh()
    })
  },
  methods: {
    /* ----------------- 事件监听相关方法 ------------------ */
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
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    /* 回到顶部 */
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      /* 判断 backTop 是否显示 */
      this.isShowBackTop = (-position.y) > 1000

      /* 决定 tabControl 是否吸顶 */
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    /* 加载更多 */
    loadMore() {
      /* console.log('上拉加载更多') */
      this.getHomeGoods(this.currentType)

      /* 图片加载完毕，BScroll重新计算高度 */
      this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad() {
      /* 获取 tabControl 的 offsetTop */
      /* 所有组件都有一个属性 $el: 用于获取组件中的元素 */
      console.log(this.$refs.tabControl2.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /* ------------------- 网路请求相关方法 ---------------------- */
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

          /* 完成上拉加载更多 */
          this.$refs.scroll.finishPullUp()
        })
    }
  }
}
</script>

<style scoped>
#home {
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: relative;
  z-index: 9;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.tab-control {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

</style>