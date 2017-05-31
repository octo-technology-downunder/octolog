require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: '',
    trigram: ''
  },
  mutations: {
    setPassword (state, password) {
      state.password = password
    },
    setTrigram (state, trigram) {
      state.trigram = trigram.toUpperCase()
    }
  },
  plugins: [createPersistedState()]
})

export default store
