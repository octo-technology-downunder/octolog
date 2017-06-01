const dynamo = require('dynamodb');
const Joi = require('joi');
const uuidV4 = require('uuid/v4');
const promisify = require("promisify-node");


const endpoint = process.env.DYNAMO_URL || undefined
dynamo.AWS.config.update({region: "ap-southeast-2", endpoint });

const basicTableName = retrieveTableName("BASICS_TABLE")

const PeopleTable = promisifySchema(dynamo.define(basicTableName, {
  hashKey : 'trigram',
  rangeKey : 'name',
  schema : {
    trigram: Joi.string().regex(/^[A-Z]{3}$/),
    name: Joi.string(),
    firstName: Joi.string(),e: Joi.string(),
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

const experiencesTableName = retrieveTableName("EXPERIENCES_TABLE")

const ExperiencesTable = promisifySchema(dynamo.define(experiencesTableName, {
  hashKey : 'trigram',
  rangeKey : 'id',
  indexes : [
    {
      name : 'octopodActivityId',
      hashKey : 'octopodActivityId',
      type : 'global'
    }
  ],
  schema : {
    id: Joi.string().default(() => uuidV4(), 'uuidV4'),
    trigram: Joi.string().regex(/^[A-Z]{3}$/),
    cvName: Joi.string(),
    octopodActivityId: Joi.number(),
    octopodProjectId: Joi.number(),
    mission: Joi.string(),
    customer: Joi.string(),
    role: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    description: dynamo.types.stringSet(),
    customerLogo: Joi.string(),
    octopodCustomerId: Joi.number(),
    isOcto: Joi.boolean().default(false),
    isDeleted: Joi.boolean().default(false),
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

function retrieveTableName(envVarName) {
  const defaultName = "octolog-local-" + envVarName + 's'
  return (process.env[envVarName] || defaultName).slice(0, -1)
}

ExperiencesTable.getExperienceByOctopodActivityIdP = function(octopodActivityId) {
  return new Promise(function(resolve, reject) {
    ExperiencesTable.query(octopodActivityId)
                        .usingIndex('octopodActivityId')
                        .exec((err, data) => {
                          if(err) return reject(err)
                          resolve(data.Items.map(i => i.attrs))
                        })
  });
}

module.exports = {
  ExperiencesTable,
  PeopleTable
}
