const { Dynamo } = require('../node_modules/dynamodb-onetable/Dynamo');
const { Table } = require('../node_modules/dynamodb-onetable');
const { DynamoDBClient } = require('../node_modules/@aws-sdk/client-dynamodb');
const existingModels = require('./models');

const params = {

};

const client = new Dynamo({
  client: new DynamoDBClient(params),
  // V3: true,
});

const schema = {
  format: 'onetable:1.1.0',
  version: '1.0.0',
  params: {

  },
  indexes: {
    primary: { hash: 'PK', sort: 'SK' },
    gs1: { hash: 'GS1PK', sort: 'GS1SK', follow: true },
    gs2: { hash: 'GS2PK', sort: 'GS2SK', follow: true },
    ls1: { sort: 'id', type: 'local' },
  },
  models: existingModels,
};

const singleTable = new Table({
  client,
  schema,
  name: process.env.DYNAMODB_TABLE_NAME,
});

const outputModels = {};
Object.keys(schema.models).forEach((modelName) => {
  outputModels[modelName] = singleTable.getModel(modelName);
});

module.exports = {
  table: singleTable,
  Models: outputModels,
};
