'use strict';

const { ExperiencesTable, PeopleTable } = require('./dynamo/schema')
const uuidV4 = require('uuid/v4');
const async = require("async");

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
  ExperiencesTable.get(trigram, id, callback)
};


module.exports.create = (event, context, callback) => {
  const trigram = event.path.trigram
  const body = event.body
  body.trigram = trigram
  ExperiencesTable.create(body, callback)
};


module.exports.getAll = (event, context, callback) => {
  const trigram = event.path.trigram
  ExperiencesTable
    .query(trigram)
    .exec((err, data) => {
      if(err) return callback(err)
      callback(null, separateOctoAndNoneOctoExp(data.Items))
    });
};


module.exports.delete = (event, context, callback) => {
  const trigram = event.path.trigram
  const id = event.path.id
  ExperiencesTable.getP(trigram, id, { AttributesToGet : ['id'] })
    .then((exp) => {
      if(exp == null) throw new Error(`The experience ${id} was not found`)
      return [trigram, id];
    })
    .then(trigramAndId => ExperiencesTable.destroyP(...trigramAndId))
    .then(data => callback(null, { id, trigram }))
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

module.exports.separateOctoAndNoneOctoExp = separateOctoAndNoneOctoExp
