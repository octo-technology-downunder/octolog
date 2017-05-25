const rp = require('request-promise-native')
const _ = require('lodash')
const { ExperiencesTable, PeopleTable } = require('./dynamo/schema')


function octopodUrl() {
  return process.env.OCTOPOD_URL || "https://octopod.octo.com"
}

function sync(event, context, callback) {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const trigram = event.path.trigram
  const cvName = event.path.name

  getAuth(clientId, clientSecret)
    .then(accessToken => {
      return getOctoId(trigram, accessToken)
        .then(personId => getActivitiesFromOctopod(accessToken, personId))
        .then(activities => createExperienceIfNotexisting(activities, trigram, cvName))
        .then(activities => callback(null, activities.map(prepareExperience)))
        .catch(callback)
    })
    .catch(callback)
}

function prepareExperience(exp) {
  if(exp.tags == null) exp.tags = []
  if(exp.description == null) exp.description = []
  if(exp.customerLogo == null) exp.customerLogo = null
  delete exp.isOcto
  return exp
}

function createExperienceIfNotexisting(activities, trigram, cvName) {
  return Promise.all(activities.map(act => {
    return ExperiencesTable.getExperienceByOctopodActivityIdP(act.id)
      .then(experiences => {
        experiences = experiences.filter(exp => exp.cvName === cvName)
        return experiences.length === 0 ? null : experiences[0]
      })
      .then((actInDb) => {
        if(actInDb == null) {
          const exp = {
            octopodActivityId: act.id,
            trigram,
            octopodProjectId: act.project.id,
            mission: act.project.name,
            from: act.from,
            cvName,
            to: act.to,
            isOcto: true,
            customer: act.project.customer.name,
            role: act.title,
            description: []
          }
          return ExperiencesTable.createP(exp)
                    .then(i => i.attrs)
        }
        return actInDb
      })
  }))
}


function getAuth(clientId, clientSecret) {
  const options = {
    method: 'POST',
    uri: octopodUrl() + '/api/oauth/token',
    form: {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
    }
  };

  return rp(options).then((body) => "Bearer " + JSON.parse(body).access_token)
}

function getOctoId(trigram, authToken) {
  var options = {
    method: 'GET',
    uri: octopodUrl() + '/api/v0/people?all=true',
    headers: {
        Authorization: authToken
    }
  };

  return rp(options)
    .then(body => {
      body = JSON.parse(body)
      const personFoundAsArray = body.filter(i => i.nickname === trigram)
      if(personFoundAsArray.length === 0) throw new Error(`Person ${trigram} not found`)
      return body.filter(i => i.nickname === trigram)[0].id
    })
}


function getActivitiesFromOctopod(authToken, personId) {
  const resultPerPage = 1000
  function activityCall(pageNumber, activities) {
    const options = {
      method: 'GET',
      uri: `${octopodUrl()}/api/v0/people/${personId}/time_input?page=${pageNumber}&per_page=${resultPerPage}`,
      headers: {
          Authorization: authToken
      }
    };

    return rp(options)
      .then(body => {
        return JSON.parse(body)
                  .map(i => {
                    const v = i.activity
                    v.from = i.day
                    v.to = i.day
                    return v
                  })
      })
      .then(newActivities => {
        activities.push(...newActivities)
        if(newActivities.length >= resultPerPage) {
          return activityCall(pageNumber + 1, activities)
        } else {
          return activities;
        }
      })
  }

  return activityCall(1, []).then(activities => {
      const activitiesAsObject = activities
        .filter(act => act.project != null && act.project.kind != 'internal')
        .reduce(setupUniqActivitiesAndDate, {})
    return Object.keys(activitiesAsObject).map(key => activitiesAsObject[key])
  })

  function setupUniqActivitiesAndDate(acc, item) {
    if(acc[item.id] == null) {
      acc[item.id] = item
    } else {
      if(acc[item.id].from > item.from) {
        acc[item.id].from = item.from
      }
      if(acc[item.id].to < item.to) {
        acc[item.id].to = item.to
      }
    }
    return acc;
  }


}

module.exports = {
  sync,
  getAuth,
  getOctoId,
  getActivitiesFromOctopod,
  createExperienceIfNotexisting
}
