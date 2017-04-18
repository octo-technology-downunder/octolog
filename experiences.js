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

  ExperiencesTable.create(body, (err, experience) => {
    if (err) return callback(err)
    PeopleTable.get(trigram, (err, people) => {
      if (err) return callback(err)

      people.attrs.experiencesId = people.experiencesId || []
      people.attrs.experiencesId.push(experience.attrs.id)
      PeopleTable.update(people.attrs, (err, newPeople) => {
        if (err) return callback(err)
        callback(null, experience.attrs)
      })
    })
  })
};


module.exports.getAll = (event, context, callback) => {
  const trigram = event.path.id

  PeopleTable.get(trigram, (err, people) => {
    if(err) return callback(err)
    async.map(people.attrs.experiencesId, ExperiencesTable.get, (err, results) => {
      callback(null, results.map(i => i.attrs))
    })
  })
};
