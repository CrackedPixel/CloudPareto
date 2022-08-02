const { makeExecutableSchema } = require('@graphql-tools/schema');

const checkAllList = [
  require('./products'),
  require('./users'),
  require('./warehouses'),
  require('./warehouseInventory'),
];

const resolvers = [];
const typeDefs = [];

// ####################
// ## Combine Schema ##
// ####################
checkAllList.forEach((item) => {
  if ('resolver' in item) {
    resolvers.push(item.resolver);
  }

  if ('typeDefs' in item) {
    typeDefs.push(item.typeDefs);
  }
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = {
  schema,
};
