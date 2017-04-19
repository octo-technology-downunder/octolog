const rp = require('request-promise-native')

function sync(event, context, callback) {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET

  getAuth(clientId, clientSecret)
    .then(accessToken => callback(null, { "access": accessToken} ))
    .catch(callback)
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
  return rp(options).then((body) => "Authorization: Bearer " + JSON.parse(body).access_token)
}

module.exports = {sync, getAuth}
