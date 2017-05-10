'use strict';

const PeopleTable = require('./dynamo/schema').PeopleTable


module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.trigram
  body.trigram = trigram
  PeopleTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.trigram
  PeopleTable.get(trigram, (err, data) => {
    if(err) return callback(err)
    if(data == null) return callback(new Error(`The person ${trigram} was not found`))
    callback(null, data)
  })
};

module.exports.delete = (event, context, callback) => {
  const trigram = event.path.trigram
  PeopleTable.getP(trigram, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person == null) throw new Error(`The person ${trigram} was not found`)
      return trigram;
    })
    .then(PeopleTable.destroyP)
    .then(data => callback(null, data))
    .catch(callback)

};
