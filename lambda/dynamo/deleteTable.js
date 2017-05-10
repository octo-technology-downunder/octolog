const dynamo = require('dynamodb');
const Joi = require('joi');
const uuidV4 = require('uuid/v4');
const Dao = require('./cv-schema')
const dao = new Dao('octolog-test-cvs')

dao.CvTable.deleteTable(function(err) {
  if (err) {
    console.error('Error deleting tables: ', err);
  } else {
    console.log('Tables has been deleted');
  }
});
