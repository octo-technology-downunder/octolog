const rp = require('request-promise-native')
const _ = require('lodash')
const PeopleTable = require('./dynamo/schema').PeopleTable


function askbobUrl() {
  return process.env.OCTOPOD_URL || "http://askbob.octo.com"
}

function sync(event, context, callback) {
  const apiKey = process.env.API_KEY
  const trigram = event.path.id

  getInfo(apiKey, trigram)
    .then(jsonResponse => {
      let basics = extractBasic(jsonResponse)
      basics = extractSkills(basics, jsonResponse)
      basics = extractPicture(basics, jsonResponse)
      return basics
    })
    .then(basics => callback(null, basics))
    .catch(callback)
}

function getInfo(token, trigram) {
  const options = {
    method: 'GET',
    uri: askbobUrl() + '/api/v1/people/' + trigram + '?api_key=' + token
  };
  return rp(options)
    .then(JSON.parse)
    .then(json => json.items[0])
}

function extractBasic(askbobInfo) {
  return {
    job: askbobInfo.job,
    trigram: askbobInfo.nickname,
    firstName: askbobInfo.first_name,
    lastName: askbobInfo.last_name
  }
}

function extractSkills(basics, jsonReponse) {
  return basics
}

function extractPicture(basics, jsonReponse) {
  return basics
}


module.exports = { sync, getInfo, extractBasic, extractSkills, extractPicture }
