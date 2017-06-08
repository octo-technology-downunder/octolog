require('es6-promise').polyfill()
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getters } from './getters'
import { mutations } from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    password: '',
    trigram: '',
    experiences: {octo: [], priorToOcto: []},
    profile: {education: {}, skills: {}}
  },
  getters,
  mutations,
  plugins: [createPersistedState()]
})

export default store
