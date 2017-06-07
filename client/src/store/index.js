require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: '',
    trigram: '',
    octoMissions: []
  },
  getters: {
    trigram: state => {
      return state.trigram
    },
    password: state => {
      return state.password
    },
    octoMissions: state => {
      return state.octoMissions
    }
  },
  mutations: {
    setPassword (state, password) {
      state.password = password
    },
    setTrigram (state, trigram) {
      state.trigram = trigram.toUpperCase()
    },
    setMissions (state, missions) {
      state.missions = missions
    }
  },
  plugins: [createPersistedState()]
})

export default store
