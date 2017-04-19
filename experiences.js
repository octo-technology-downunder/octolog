'use strict';

const { ExperiencesTable, PeopleTable } = require('./dynamo/config')
const uuidV4 = require('uuid/v4');
const async = require("async");

module.exports.update = (event, context, callback) => {
  const id = event.path.id
  const body = event.body
  body.id = id
  ExperiencesTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const id = event.path.id
  ExperiencesTable.get(id, callback)
};


module.exports.create = (event, context, callback) => {
  const trigram = event.path.id
  const body = event.body
  ExperiencesTable.createP(body)
    .then(function (experience) {
      PeopleTable.getP(trigram)
        .then(function (people) {
          people.attrs.experiencesId = people.experiencesId || [];
          people.attrs.experiencesId.push(experience.attrs.id);
          return PeopleTable.updateP(people.attrs);
        })
        .then(function (newPeople) {
          callback(null, experience.attrs);
        }, callback);
      },callback);
};


module.exports.getAll = (event, context, callback) => {
  const trigram = event.path.id

  PeopleTable.getP(trigram)
    .then((people) => {
      const experiencesPromises = people.attrs.experiencesId.map(ExperiencesTable.getP)
      return Promise.all(experiencesPromises)
    })
    .then((results) => {
      callback(null, results.map(i => i.attrs))
    }, callback)
};
