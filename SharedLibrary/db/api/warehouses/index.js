const fs = require('fs');
const warehouseService = require('../../services/warehouse.service');
const typeDefs = fs.readFileSync(`${__dirname}/warehouse.graphql`).toString();

const resolver = {
  Query: {
    warehouseById: (root, { id }, context, info) => {
      return warehouseService.findById(id);
    },
    warehouses: (root, { first, next, prev }, context, info) => {
      return warehouseService.findAll(first, next);
    },
    warehouseByWarehouseId: (root, { warehouseId }, context, info) => {
      return warehouseService.findByWarehouseId(warehouseId);
    }
  },
  Mutation: {
    createWarehouse: (root, { warehouseReq }, context, info) => {
      return warehouseService.createWarehouse(warehouseReq);
    },
    editWarehouse: (root, { id, warehouseReq }, context, info) => {
      return warehouseService.editWarehouse(id, warehouseReq);
    },
    removeWarehouse: (root, { id }, context, info) => {
      return warehouseService.removeWarehouse(id);
    },
  },
};

module.exports = {
  typeDefs,
  resolver,
};