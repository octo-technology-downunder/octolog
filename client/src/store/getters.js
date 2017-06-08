export const trigram = state => {
  return state.trigram
}

export const password = state => {
  return state.password
}

export const octoMissions = state => {
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
}

export const priorExperience = state => {
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

export const profile = state => {
  return state.profile
}

export const education = state => {
  return state.profile.education
}

export const skills = state => {
  return state.profile.skills
}
