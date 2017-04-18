'use strict';

const ExperiencesTable = require('./dynamo/config').ExperiencesTable

module.exports.update = (event, context, callback) => {
  const id = event.path.id
  const body = event.body
  body.id = id
  console.log(body)
  ExperiencesTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const id = event.path.id
  console.log("id: " + id)
  ExperiencesTable.get(id, callback)
};
