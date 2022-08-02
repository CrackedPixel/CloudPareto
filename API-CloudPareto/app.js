const Fastify = require('../SharedLibrary/node_modules/fastify');
const mercurius = require('../SharedLibrary/node_modules/mercurius');

const API = require('../SharedLibrary/db/api');

const app = Fastify();

// ####################
// ## Authentication ##
// ####################
const viewer = {
  userId: 123,
};

// ##############
// ## Register ##
// ##############
app.register(mercurius, {
  schema: API.schema,
  viewer,
});

module.exports = app;
