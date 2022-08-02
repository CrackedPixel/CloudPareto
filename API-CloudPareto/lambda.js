const awsLambdaFastify = require('../SharedLibrary/node_modules/@fastify/aws-lambda');
const app = require('./app');
let proxy;

const universal = async (event) => {
  if (!proxy) {
    proxy = awsLambdaFastify(app);
  }

  console.log('API Event');
  console.log(event);

  return proxy(event);
};

module.exports = {
  universal,
};
