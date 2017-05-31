'use strict';

const PeopleTable = require('./dynamo/schema').PeopleTable
const _ = require('lodash')
const web = require('./lib/web')

module.exports.update = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const trigram = event.pathParameters.trigram
  const name = event.pathParameters.name
  body.trigram = trigram
  body.name = name
  PeopleTable.createP(body)
    .then(data => {
      web.ok(setupDefault(data.attrs), callback)
    })
    .catch(callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.pathParameters.trigram
  const name = event.pathParameters.name

  PeopleTable.getP(trigram, name)
    .then(data => {

      if(data == null) {
        web.notFound(`The CV ${name} of ${trigram} was not found`, callback)
      }
      web.ok(setupDefault(data.attrs), callback)
    })
    .catch(callback)
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
