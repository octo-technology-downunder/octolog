require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: ''
  },
  mutations: {
    setPassword (state, password) {
      state.password = password
    }
  }
})

export default store
