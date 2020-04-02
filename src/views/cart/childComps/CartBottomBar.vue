<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button @click.native="checkClick" :value="isSelectAll" class="check-button" />
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div @click="clacClick" class="calculate">
      去结算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from './CheckButton'

import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
    return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.cartList.length === 0) return false

      /* return !(this.cartList.filter(item => !item.checked).length) */
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick() {
      if(this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false)
      } else {
        this.cartList.forEach(item => item.checked = true)
      }
    },
    clacClick() {
      if(!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  position: relative;
  height: 40px;
  background-color: #dad6d6;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 30px;
}

.check-button {
  line-height: 20px;
  margin-right: 5px;
}

.calculate {
  width: 30%;
  background-color: var(--color-high-text);
  text-align: center;
  color: #fff;
}
</style>
