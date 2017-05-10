'use strict';

const CvTable = require('./dynamo/cv-schema').CvTable


module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.id
  body.trigram = trigram
  CvTable.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.id
  CvTable.query(trigram).exec((err, data) => {
    if(err) return callback(err)
    if(data == null) return callback(new Error(`The person ${trigram} was not found`))
    callback(null, data)
  })
};

module.exports.delete = (event, context, callback) => {
  const trigram = event.path.id
  CvTable.getP(trigram, { AttributesToGet : ['trigram'] })
    .then((person) => {
      if(person == null) throw new Error(`The person ${trigram} was not found`)
      return trigram;
    })
    .then(CvTable.destroyP)
    .then(data => callback(null, data))
    .catch(callback)

};
