'use strict';

const  dynamo = require('dynamodb');
const Joi = require('joi');

dynamo.AWS.config.update({region: "ap-southeast-2"});


const Experiences = dynamo.define('Experience', {
  hashKey : 'projectId',
  // add the timestamp attributes (updatedAt, createdAt)
  timestamps : true,
  schema : {
    projectId: Joi.number(),
    mission: Joi.string(),
    customer: Joi.string(),
    role: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    description: dynamo.types.stringSet()
  }
});


module.exports.update = (event, context, callback) => {
  const projectId = parseInt(event.path.id)
  const body = event.body
  body.projectId = projectId
  console.log(body)
  Experiences.create(body, callback)
};


module.exports.get = (event, context, callback) => {
  const projectId = parseInt(event.path.id)
  Experiences.get(projectId, callback)
};
