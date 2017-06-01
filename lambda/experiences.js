'use strict';

const { ExperiencesTable, PeopleTable } = require('./dynamo/schema')
const uuidV4 = require('uuid/v4');
const async = require("async");
const _ = require('lodash')
const web = require('./lib/web')


module.exports.update = (event, context, callback) => {
  const id = event.path.id
  const trigram = event.path.trigram
  const body = event.body
  body.trigram = trigram
  body.id = id
  ExperiencesTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const id = event.path.id
  const trigram = event.path.trigram
  ExperiencesTable.getP(trigram, id)
    .then(exp => callback(null, setupDefault(exp)))
    .catch(callback)
};


module.exports.create = (event, context, callback) => {
  const trigram = event.path.trigram
  const cvName = event.path.name
  const body = event.body
  body.cvName = cvName
  body.trigram = trigram
  ExperiencesTable.create(body, callback)
};


module.exports.getAll = (event, context, callback) => {
  const trigram = event.path.trigram
  const cvName = event.path.name
  ExperiencesTable
    .query(trigram)
    .exec((err, data) => {
      if(err) return callback(err)
      const filteredExp = data.Items
                                .map(z => z.attrs)
                                .filter(z => z.cvName === cvName)
                                .map(setupDefault)
      callback(null, separateOctoAndNoneOctoExp(filteredExp))
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
