const LambdaLib = require('../libs/lambda');

const SendGraphQL = async (lambdaTaskName, graph, path = '/graphql') => {
  const graphEvent = {
    path,
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graph),
  };

  return await LambdaLib.Invoke(lambdaTaskName, graphEvent, 'Event');
};

module.exports = {
  SendGraphQL,
};
