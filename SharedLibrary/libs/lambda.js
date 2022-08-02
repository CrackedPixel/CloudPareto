const { LambdaClient, InvokeCommand } = require('../node_modules/@aws-sdk/client-lambda');

const Lambda = new LambdaClient({
  region: process.env.REGION,
});

const Invoke = async (FunctionName, Payload, InvocationType = 'RequestResponse') => {
  const data = {
    FunctionName,
    InvocationType,
    Payload: JSON.stringify(Payload),
  };

  const command = new InvokeCommand(data);
  return await Lambda.send(command);
};

module.exports = {
  Invoke,
};
