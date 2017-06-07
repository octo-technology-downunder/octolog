require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: '',
    trigram: 'TRI',
    experiences: {octo: [], priorToOcto: []}
  },
  getters: {
    trigram: state => {
      return state.trigram
    },
    password: state => {
      return state.password
    },
    octoMissions: state => {
      return state.experiences.octo.sort(latestEndingFirst)
    },
    priorExperience: state => {
      return state.experiences.priorToOcto.sort(latestEndingFirst)
    }
  },
  mutations: {
    setPassword (state, password) {
      state.password = password
    },
    setTrigram (state, trigram) {
      state.trigram = trigram.toUpperCase()
    },
    setExperiences (state, experiences) {
      state.experiences = experiences
    }
  }
})

const latestEndingFirst = function (a, b) {
  if (a.to < b.to) {
    return 1
  }
  if (a.to > b.to) {
    return -1
  }
  return 0
}

export default store
