const rp = require('request-promise-native')
const _ = require('lodash')
const { ExperiencesTable, PeopleTable } = require('./dynamo/config')

function sync(event, context, callback) {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const trigram = event.path.id

  getAuth(clientId, clientSecret)
    .then(accessToken => {
      return getOctoId(trigram, accessToken)
        .then(getActivitiesFromOctopod.bind(undefined,accessToken))
        .then(createExperienceIfNotexisting.bind(undefined,trigram))
        .then(updatePersonWithExperience.bind(undefined,trigram))
        .then(activities => callback(null, activities))
        .catch(callback)
    })
    .catch(callback)
}

function createExperienceIfNotexisting(trigram, activities) {
  return activities.map(act => {
    act.id = act.id + ""

    return ExperiencesTable.getP(act.id)
      .then((actInDb) => {
        if(actInDb == null) {
          const exp = {
            id: act.id,
            projectId: act.project.id,
            mission: act.project.name,
            customer: act.project.customer.name,
            role: act.title
          }
          return ExperiencesTable.createP(exp)
        }
        return actInDb
      }).then(i => i.attrs)
  })
}

function updatePersonWithExperience(trigram, experiencesP) {
  return Promise.all(experiencesP)
    .then(experiences => {
      return PeopleTable.getP(trigram)
        .then((people) => {
          people.attrs.experiencesId = people.experiencesId || [];
          people.attrs.experiencesId.push(...experiences.map(exp => exp.id));
          return PeopleTable.updateP(people.attrs);
        })
        .then(() => experiences);
    })
}


function getAuth(clientId, clientSecret) {
  var options = {
    method: 'POST',
    uri: 'https://octopod.octo.com/api/oauth/token',
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
    uri: 'https://octopod.octo.com/api/v0/people?all=true',
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
      uri: `https://octopod.octo.com/api/v0/people/${personId}/time_input?page=${pageNumber}&per_page=${resultPerPage}`,
      headers: {
          Authorization: authToken
      }
    };
    return rp(options)
      .then(body => {
        return JSON.parse(body)
                  .map(i => i.activity)
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
      const filteredAct = activities
        .filter(act => act.project != null && act.project.kind != 'internal')
      return _.uniqBy(filteredAct, "id")
  })


}

module.exports = {sync, getAuth, getOctoId, getActivitiesFromOctopod}
