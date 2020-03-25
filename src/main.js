import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

axios({
  url: 'http://123.207.32.32:8000/api/wh/home/multidata'
}).then(res => {
  console.log(res)
})
