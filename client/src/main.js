import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

require('./assets/css/main.css')

Vue.create = function (options) {
  return new Vue(options)
}

Vue.create({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
