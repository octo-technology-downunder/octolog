require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: '',
    trigram: '',
    experiences: {octo: [], priorToOcto: []},
    profile: {education: {}, skills: {}}
  },
  getters: {
    trigram: state => {
      return state.trigram
    },
    password: state => {
      return state.password
    },
    octoMissions: state => {
      const latestEndingFirst = function (a, b) {
        if (a.to < b.to) {
          return 1
        }
        if (a.to > b.to) {
          return -1
        }
        return 0
      }
      return state.experiences.octo.sort(latestEndingFirst)
    },
    priorExperience: state => {
      const latestEndingFirst = function (a, b) {
        if (a.to < b.to) {
          return 1
        }
        if (a.to > b.to) {
          return -1
        }
        return 0
      }
      return state.experiences.priorToOcto.sort(latestEndingFirst)
    },
    profile: state => {
      return state.profile
    },
    education: state => {
      return state.profile.education
    },
    skills: state => {
      return state.profile.skills
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
    },
    setProfile (state, profile) {
      state.profile = profile
    },
    mergeProfile (state, profile) {
      Object.assign(this.profile, profile)
    },
    deleteExperience (state, experience) {
      state.experiences.octo = state.experiences.octo.filter(function (element) { return element.id !== experience.id })
    },
    addPriorToOctoExperience (state, experience) {
      state.experiences.priorToOcto.push(experience)
    }
  },
  plugins: [createPersistedState()]
})

export default store
