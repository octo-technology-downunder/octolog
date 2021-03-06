export const getters = {
  trigram (state) {
    return state.trigram
  },
  password (state) {
    return state.password
  },
  profile (state) {
    return state.profile
  },
  education (state) {
    return state.profile.education
  },
  skills (state) {
    return state.profile.skills
  },
  octoMissions (state) {
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
  priorExperience (state) {
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
  }
}
