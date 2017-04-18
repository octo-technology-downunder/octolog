const dynamo = require('dynamodb');
const Joi = require('joi');


const endpoint = process.env.DYNAMO_URL || undefined
dynamo.AWS.config.update({region: "ap-southeast-2", endpoint });


const PeopleTable = dynamo.define('People', {
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
      architectureTechnologies: dynamo.types.stringSet(),
      methodologies: dynamo.types.stringSet(),
      achievements: dynamo.types.stringSet()
    }
  }
});

const ExperiencesTable = dynamo.define('Experience', {
  hashKey : 'projectId',
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


module.exports = {
  ExperiencesTable,
  PeopleTable
}
