const dynamo = require('dynamodb');
const Joi = require('joi');
const uuidV4 = require('uuid/v4');
const Dao = require('./cv-schema')
const dao = new Dao('octolog-test-cvs')

dao.dynamo.createTables(function(err) {
  if (err) {
    console.error('Error creating tables: ', err);
  } else {
    console.log('Tables has been created');
  }
});
