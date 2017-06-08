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
    state.profile = mergeDeep(state.profile, profile)
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

export function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

export function isArray (item) {
  return (item && Array.isArray(item) && item !== null)
}

export default function mergeDeep (target, source) {
  let output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]})
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else if (isArray(source[key]) && isArray(target[key])) {
        output[key] = source[key].concat(target[key])
      } else {
        Object.assign(output, {[key]: source[key]})
      }
    })
  }
  return output
}
