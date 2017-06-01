module.exports = {
  NODE_ENV: '"production"',
  API_URL: process.env.API_URL || '"https://private-7723ff-octolog.apiary-mock.com"',
  LIST_BASICS_PATH: '"/people/{trigram}/cv/default"',
  LIST_EXPERIENCES_PATH: '"/people/{trigram}/cv/default/experiences"',
  UPDATE_EXPERIENCE_PATH: '"/people/{trigram}/experiences/{id}"',
  DELETE_EXPERIENCE_PATH: '"/people/{trigram}/experiences/{id}"',
  UPDATE_BASICS_PATH: '"/people/{trigram}/cv/default"',
  SYNC_OCTOPOD_PATH: '"/people/{trigram}/cv/default/octopod/sync"',
  SYNC_ASKBOB_PATH: '"/people/{trigram}/cv/default/askbob/sync"'
}
