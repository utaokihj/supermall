import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios'
import store from './store'

import toast from 'components/common/toast'

Vue.config.productionTip = false

/* 添加事件总线 */
Vue.prototype.$bus = new Vue()
/* 安装 toast 插件 */
Vue.use(toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

axios({
  url: ''
}).then(res => {
  console.log(res)
})