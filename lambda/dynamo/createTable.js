const dynamo = require('dynamodb');
require('./schema')

dynamo.createTables(function(err) {
  if (err) {
    console.error('Error creating tables: ', err);
  } else {
    console.log('Tables has been created');
  }
});
