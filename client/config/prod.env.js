module.exports = {
  NODE_ENV: '"production"',
  API_URL: process.env.API_URL || '"https://private-7723ff-octolog.apiary-mock.com"',
  LIST_BASICS_PATH: '"/people/{trigram}/basics"',
  LIST_EXPERIENCES_PATH: '"/people/{trigram}/experiences"',
  UPDATE_EXPERIENCE_PATH: '"/people/{trigram}/experiences/{id}"',
  UPDATE_BASICS_PATH: '"/people/{trigram}/basics"',
  SYNC_OCTOPOD_PATH: '"/people/{trigram}/octopod/sync"',
  SYNC_ASKBOB_PATH: '"/people/{trigram}/askbob/sync"'
}
