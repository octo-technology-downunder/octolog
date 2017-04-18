'use strict';

const PeopleTable = require('./dynamo/config').PeopleTable


module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.id
  body.trigram = trigram
  PeopleTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.id
  PeopleTable.get(trigram, callback)
};
