export const mutations = {
  setPassword (state, password) {
    state.password = password
  },
  setTrigram (state, trigram) {
    state.trigram = trigram.toUpperCase()
  },
  setProfile (state, profile) {
    state.profile = profile
  },
  mergeProfile (state, profile) {
    Object.assign(this.profile, profile)
  },
  setExperiences (state, experiences) {
    state.experiences = experiences
  },
  updateOctoExperience (state, experience) {
    mutations.deleteOctoExperience(state, experience)
    state.experiences.octo.push(experience)
  },
  deleteOctoExperience (state, experience) {
    state.experiences.octo = state.experiences.octo.filter(function (element) { return element.id !== experience.id })
  },
  addPriorToOctoExperience (state, experience) {
    state.experiences.priorToOcto.push(experience)
  },
  setOctoExperiences (state, octoExperiences) {
    state.experiences.octo = octoExperiences
  }
}
