require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: '',
    trigram: 'TRI'
  },
  mutations: {
    setPassword (state, password) {
      state.password = password
    },
    setTrigram (state, trigram) {
      state.trigram = trigram
    }
  },
})

export default store
