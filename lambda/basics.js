'use strict';

const PeopleTable = require('./dynamo/schema').PeopleTable
const _ = require('lodash')

module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.trigram
  body.trigram = trigram
  PeopleTable.createP(body)
    .then(data => {
      callback(null, setupDefault(data))
    })
    .catch(callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.trigram
  PeopleTable.get(trigram, (err, data) => {
    if(err) return callback(err)
    if(data == null) return callback(new Error(`The person ${trigram} was not found`))
    callback(null, setupDefault(data))
  })
};

module.exports.delete = (event, context, callback) => {
  const trigram = event.path.trigram
  PeopleTable.getP(trigram, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person == null) throw new Error(`The person ${trigram} was not found`)
      return trigram;
    })
    .then(PeopleTable.destroyP)
    .then(data => callback(null, setupDefault(data)))
    .catch(callback)

};
function setupDefault(basics) {
  const defaultValue = {
    skills: {
      technical: [],
      architectureTechnologies: [],
      methodologies: [],
      achievements: [],
      others: []
    },
    education: []
  }

  return _.merge(defaultValue, basics);
}

module.exports.setupDefault = setupDefault
