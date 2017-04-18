'use strict';

const ExperiencesTable = require('./dynamo/config').ExperiencesTable

module.exports.update = (event, context, callback) => {
  const projectId = parseInt(event.path.id)
  const body = event.body
  body.projectId = projectId
  console.log(body)
  ExperiencesTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const projectId = parseInt(event.path.id)
  ExperiencesTable.get(projectId, callback)
};
