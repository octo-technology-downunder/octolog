export const mutations = {
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
}
