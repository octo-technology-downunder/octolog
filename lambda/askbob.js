const rp = require('request-promise-native')
const _ = require('lodash')
const PeopleTable = require('./dynamo/schema').PeopleTable


function askbobUrl() {
  return process.env.OCTOPOD_URL || "http://askbob.octo.com"
}

function sync(event, context, callback) {
  const apiKey = process.env.API_KEY
  const trigram = event.path.id

retrieveInfoFromDB(trigram).then(basicInDb => {
    let newBasics = basicInDb
    return getInfo(apiKey, trigram)
      .then(jsonResponse => {
        newBasics = extractBasic(newBasics, jsonResponse)
        newBasics = extractSkills(newBasics, jsonResponse)
        newBasics = extractPicture(newBasics, jsonResponse)
        return newBasics
      })
      .catch(callback)
  })
  .then(PeopleTable.updateP)
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

function extractBasic(oldBasics, askbobInfo) {
  const newbasics = {
    job: askbobInfo.job,
    trigram: askbobInfo.nickname,
    firstName: askbobInfo.first_name,
    lastName: askbobInfo.last_name
  }
  return Object.assign(newbasics, oldBasics);
}

function extractSkills(basics, jsonReponse) {
  return basics
}

function extractPicture(basics, jsonReponse) {
  return basics
}

function retrieveInfoFromDB(trigram) {
  return PeopleTable.getP(trigram).then(info => {
    return info == null ? {} : info.attrs
  });
}


module.exports = { sync, getInfo, extractBasic, extractSkills, extractPicture, retrieveInfoFromDB }
