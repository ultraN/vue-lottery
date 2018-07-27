import Vue from 'vue'
import App from './App'
import Lottery from '../src'
Vue.config.productionTip = false

Vue.use(Lottery)

new Vue({
  el: '#app',
  render: h => h(App)
})