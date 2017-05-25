'use strict';

const PeopleTable = require('./dynamo/schema').PeopleTable
const _ = require('lodash')

module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.trigram
  const name = event.path.name
  body.trigram = trigram
  body.name = name
  PeopleTable.createP(body)
    .then(data => {
      callback(null, setupDefault(data))
    })
    .catch(callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.trigram
  const name = event.path.name
  PeopleTable.get(trigram, name, (err, data) => {
    if(err) return callback(err)
    if(data == null) return callback(new Error(`The CV ${name} of ${trigram} was not found`))
    callback(null, setupDefault(data))
  })
};

module.exports.delete = (event, context, callback) => {
  const trigram = event.path.trigram
  const name = event.path.name
  PeopleTable.getP(trigram, name, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person == null) throw new Error(`The CV ${name} of ${trigram} was not found`)
      return trigram;
    })
    .then(tri => PeopleTable.destroyP(trigram, name))
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
