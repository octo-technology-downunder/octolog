'use strict';

const PeopleTable = require('./dynamo/schema').PeopleTable


module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.id
  body.trigram = trigram
  PeopleTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.id
  PeopleTable.get(trigram, (err, data) => {
    if(err) return callback(err)
    if(data == null) return callback(new Error(`The person ${trigram} was not found`))
    delete data.experiencesId
    callback(null, data)
  })
};
