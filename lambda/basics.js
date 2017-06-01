'use strict';

const PeopleTable = require('./dynamo/schema').PeopleTable
const _ = require('lodash')
const web = require('./lib/web')

module.exports.update = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const trigram = event.pathParameters.trigram
  const name = event.pathParameters.name

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(name == null) return web.paramError("The path parameter 'name' is required", callback)

  body.trigram = trigram
  body.name = name
  PeopleTable.getP(trigram, name, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person == null) {
        return PeopleTable.createP(body)
      }
      return PeopleTable.updateP(body)
    })
    .then(data => {
      return web.ok(setupDefault(data.attrs), callback)
    })
    .catch(callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.pathParameters.trigram
  const name = event.pathParameters.name

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(name == null) return web.paramError("The path parameter 'name' is required", callback)

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
  const trigram = event.pathParameters.trigram
  const name = event.pathParameters.name

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(name == null) return web.paramError("The path parameter 'name' is required", callback)

  PeopleTable.getP(trigram, name, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person != null) {
        return PeopleTable.destroyP(trigram, name)
      }
      return null;
    })
    .then(data => {
      if (data == null) {
        return web.notFound(`The CV ${name} of ${trigram} was not found`, callback)
      }
      web.deleted(callback)
    })
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
