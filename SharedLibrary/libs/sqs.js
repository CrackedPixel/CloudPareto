const { randomUUID } = require('crypto');
const { SQSClient, SendMessageCommand, SendMessageBatchCommand } = require('../node_modules/@aws-sdk/client-sqs');
const lodash = require('../node_modules/lodash');

const SQS = new SQSClient({
  region: process.env.REGION,
});

const SQS_CHUNK_SIZE = 10;

const SendMessage = async (queueName, message) => {
  const data = {
    QueueUrl: queueName,
    MessageBody: JSON.stringify(message),
  };

  const command = new SendMessageCommand(data);
  return await SQS.send(command);
};

const SendMessageBatch = async (queueName, messageArray) => {
  const chunked = lodash.chunk(messageArray, SQS_CHUNK_SIZE);
  const results = [];
  for (const chunk of chunked) {
    const data = {
      QueueUrl: queueName,
      Entries: [],
    };

    for (const message of chunk) {
      data.Entries.push({
        Id: randomUUID(),
        MessageBody: JSON.stringify(message),
      });
    }

    const command = new SendMessageBatchCommand(data);
    const result = await SQS.send(command);
    results.push(result);
  }

  return results;
};

module.exports = {
  SendMessage,
  SendMessageBatch,
};
