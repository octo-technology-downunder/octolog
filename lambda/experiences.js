'use strict';

const { ExperiencesTable, PeopleTable } = require('./dynamo/schema')
const uuidV4 = require('uuid/v4');
const async = require("async");
const _ = require('lodash')
const web = require('./lib/web')


module.exports.update = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const trigram = event.pathParameters.trigram
  const id = event.pathParameters.id

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(id == null) return web.paramError("The path parameter 'id' is required", callback)

  body.trigram = trigram
  body.id = id
  ExperiencesTable.getP(trigram, id, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person == null) {
        return ExperiencesTable.createP(body)
      }
      return ExperiencesTable.updateP(body)
    })
    .then(data => {
      return web.ok(setupDefault(data.attrs), callback)
    })
    .catch(callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.pathParameters.trigram
  const id = event.pathParameters.id

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(id == null) return web.paramError("The path parameter 'id' is required", callback)

  ExperiencesTable.getP(trigram, id)
    .then(exp => {
      if(exp == null) {
        return web.notFound(`The experience ${id} of ${trigram} was not found`, callback)
      }
      return web.ok(setupDefault(exp.attrs), callback)
    })
    .catch(callback)
};


module.exports.create = (event, context, callback) => {
  const trigram = event.pathParameters.trigram
  const cvName = event.pathParameters.name
  const body = JSON.parse(event.body)

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(cvName == null) return web.paramError("The path parameter 'name' is required", callback)

  body.cvName = cvName
  body.trigram = trigram
  ExperiencesTable.createP(body)
    .then(exp => web.created(exp.attrs, callback))
    .catch(callback)
};


module.exports.getAll = (event, context, callback) => {
  const trigram = event.pathParameters.trigram
  const cvName = event.pathParameters.name

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(cvName == null) return web.paramError("The path parameter 'name' is required", callback)

  ExperiencesTable
    .query(trigram)
    .exec((err, data) => {
      if(err) return callback(err)
      const filteredExp = data.Items
                                .map(z => z.attrs)
                                .filter(z => z.cvName === cvName)
                                .filter(z => z.isDeleted === false)
                                .map(setupDefault)
      web.ok(separateOctoAndNoneOctoExp(filteredExp), callback)
    });
};


module.exports.delete = (event, context, callback) => {
  const trigram = event.pathParameters.trigram
  const id = event.pathParameters.id

  if(trigram == null) return web.paramError("The path parameter 'trigram' is required", callback)
  if(id == null) return web.paramError("The path parameter 'id' is required", callback)

  ExperiencesTable.getP(trigram, id, { AttributesToGet : ['id'] })
    .then((exp) => {
      if(exp == null) {
        return web.notFound(`The experience ${id} was not found`, callback)
      }
      return ExperiencesTable.destroyP(trigram, id)
          .then(data => web.deleted(callback))
          .catch(callback)
    })
    .catch(callback)
};


function separateOctoAndNoneOctoExp(experiences) {
  function separateIfIsOcto(isOcto) {
    return experiences.filter(exp => exp.isOcto === isOcto).map(exp => {
      delete exp.isOcto
      return exp
    })
  }
  return {
    octo: separateIfIsOcto(true),
    priorToOcto: separateIfIsOcto(false)
  }
}

function setupDefault(exp) {
  const defaultValue = {
    customerLogo: '',
    description: [],
    tags: []
  }
  return _.merge(defaultValue, exp);
}

module.exports.setupDefault = setupDefault
module.exports.separateOctoAndNoneOctoExp = separateOctoAndNoneOctoExp
