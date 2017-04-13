'use strict';

const  dynamo = require('dynamodb');
const Joi = require('joi');

dynamo.AWS.config.update({region: "ap-southeast-2"});


const People = dynamo.define('People', {
  hashKey : 'trigram',
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps : true,
  schema : {
    trigram: Joi.string().regex(/^[A-Z]{3}$/),
    firstName: Joi.string(),
    lastName: Joi.string(),
    pictureUrl: Joi.string().uri(),
    job: Joi.string(),
    education: dynamo.types.stringSet(),
    skills: {
      technical: dynamo.types.stringSet(),
      architectureTechnologies: dynamo.types.stringSet(),
      methodologies: dynamo.types.stringSet(),
      achievments: dynamo.types.stringSet()
    }
  }
});



module.exports.update = (event, context, callback) => {
  const body = event.body
  const trigram = event.path.id
  body.trigram = trigram
  People.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const trigram = event.path.id
  People.get(trigram, callback)
};
