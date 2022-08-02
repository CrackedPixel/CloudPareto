const app = require('./app');

const universal = async (event) => {
  // ################################
  // ## Initializers would go here ##
  // ################################

  // ###########
  // ## Start ##
  // ###########
  console.log('Process File Event');
  console.log(event);
  return await app.lambdaFunction(event);
};

module.exports = {
  universal,
};
