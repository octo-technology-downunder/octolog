const rp = require('request-promise-native')
const _ = require('lodash')
const PeopleTable = require('./dynamo/schema').PeopleTable


function askbobUrl() {
    return process.env.OCTOPOD_URL || "http://askbob.octo.com"
}

function sync(event, context, callback) {
    const apiKey = process.env.API_KEY
    const clientId = process.env.CLIENT_ASKBOB_ID
    const clientSecret = process.env.CLIENT_ASKBOB_SECRET
    const trigram = event.path.trigram
    const cvName = event.path.name

    retrieveInfoFromDB(trigram, cvName).then(basicInDb => {
        let newBasics = basicInDb
        getAuth(clientId, clientSecret)
            .then(accessToken => {
                return getInfo(accessToken, trigram)
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
            .catch(callback);
    });
}

function getInfo(authToken, trigram) {
    const options = {
        method: 'GET',
        uri: askbobUrl() + '/api/v2/people/' + trigram,
        headers: {
            Authorization: authToken
        }
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
    const skills = jsonReponse.skills
        .filter(skill => skill.level > 2)
        .map(skill => skill.name)
    basics.skills = basics.skills || {}
    basics.skills.others = skills
    return basics
}

function extractPicture(basics, jsonReponse) {
    const pictureUrl = jsonReponse.photo.split('?')[0]

    return Object.assign({pictureUrl}, basics)
}

function retrieveInfoFromDB(trigram, name) {
    return PeopleTable.getP(trigram, name).then(info => {
        const defaultCV = {name}
        return info == null ? defaultCV : info.attrs
    });
}


function getAuth(clientId, clientSecret) {
    const options = {
        method: 'POST',
        uri: askbobUrl() + '/api/oauth/token',
        form: {
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret
        }
    };

    return rp(options).then((body) => "Bearer " + JSON.parse(body).access_token)
}


module.exports = {sync, getInfo, extractBasic, extractSkills, extractPicture, retrieveInfoFromDB}
