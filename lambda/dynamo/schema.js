const dynamo = require('dynamodb');
const Joi = require('joi');
const uuidV4 = require('uuid/v4');
const promisify = require("promisify-node");


const endpoint = process.env.DYNAMO_URL || undefined
dynamo.AWS.config.update({region: "ap-southeast-2", endpoint });


const PeopleTable = promisifySchema(dynamo.define('People', {
  hashKey : 'trigram',
  schema : {
    trigram: Joi.string().regex(/^[A-Z]{3}$/),
    firstName: Joi.string(),
    lastName: Joi.string(),
    pictureUrl: Joi.string().uri(),
    job: Joi.string(),
    education: dynamo.types.stringSet(),
    skills: {
      technical: dynamo.types.stringSet(),
      others: dynamo.types.stringSet(),
      architectureTechnologies: dynamo.types.stringSet(),
      methodologies: dynamo.types.stringSet(),
      achievements: dynamo.types.stringSet()
    }
  }
}));

const ExperiencesTable = promisifySchema(dynamo.define('Experience', {
  hashKey : 'trigram',
  rangeKey : 'id',
  schema : {
    id: Joi.string().default(() => uuidV4(), 'uuidV4'),
    trigram: Joi.string().regex(/^[A-Z]{3}$/),
    projectId: Joi.number(),
    mission: Joi.string(),
    customer: Joi.string(),
    role: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    description: dynamo.types.stringSet(),
    customerLogo: Joi.string().uri(),
    tags: dynamo.types.stringSet()
  }
}));

function promisifySchema(schema) {
  schema.getP = promisify(schema.get)
  schema.updateP = promisify(schema.update)
  schema.createP = promisify(schema.create)
  schema.destroyP = promisify(schema.destroy)
  return schema
}


module.exports = {
  ExperiencesTable,
  PeopleTable
}
