const dynamo = require('dynamodb');
const Joi = require('joi');
const uuidV4 = require('uuid/v4');
const promisify = require("promisify-node");


const endpoint = process.env.DYNAMO_URL || undefined
dynamo.AWS.config.update({region: "ap-southeast-2", endpoint });



function CvDao(tableName) {

  this.tableName = tableName || (process.env.CV_TABLE || 'octolog-refacto-cvs').slice(0, -1)

  this.CvTable = dynamo.define(tableName, {
    hashKey : 'trigram',
    rangeKey : 'experienceId',
    timestamps : true,
    schema : {
      trigram: Joi.string().regex(/^[A-Z]{3}$/),
      experienceId: Joi.string(),
      basics: {
        firstName: Joi.string(),
        lastName: Joi.string(),
        pictureUrl: Joi.string().uri(),
        job: Joi.string(),
        education: dynamo.types.stringSet()
      },

      skills: {
        technical: dynamo.types.stringSet(),
        fromAskbob: dynamo.types.stringSet(),
        architectureTechnologies: dynamo.types.stringSet(),
        methodologies: dynamo.types.stringSet(),
        achievements: dynamo.types.stringSet()
      },
      experience: {
        octopod: {
          projectId: Joi.number(),
          activityId: Joi.number()
        },
        mission: Joi.string(),
        customer: Joi.string(),
        role: Joi.string(),
        from: Joi.string(),
        to: Joi.string(),
        description: dynamo.types.stringSet(),
        tags: dynamo.types.stringSet()
      }
    }
  });
  this.dynamo = dynamo
  this.get = function getCv(trigram) {
    return new Promise( (resolve, reject) => {
      this.CvTable.query(trigram).exec((err, results) => {
        if(err) return reject(err)
        if(results == null || results.Count === 0) {
          return reject(new Error(`The person ${trigram} was not found`))
        }
        const cv = results[0].basics;
        cv.trigram = results[0].trigram;
        cv.experiences = results.map(i => {
          i.experience.experienceId = i.experienceId
          return i.experience
        })
        resolve(cv)
      })
    })
  }

}


module.exports = CvDao
