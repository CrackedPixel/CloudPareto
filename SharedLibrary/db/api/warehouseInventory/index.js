const fs = require('fs');
const warehouseInventoryService = require('../../services/warehouseInventory.service');
const typeDefs = fs.readFileSync(`${__dirname}/warehouseInventory.graphql`).toString();

const resolver = {
  Query: {
    warehouseInventoryById: (root, { id }, context, info) => {
      return warehouseInventoryService.findById(id);
    },
    warehouseInventories: (root, { first, next, prev }, context, info) => {
      return warehouseInventoryService.findAll(first, next, prev);
    },
    warehouseInventoriesByWarehouseId: (root, { warehouse_id, first, prev, next }, context, info) => {
      return warehouseInventoryService.findByWarehouseId(warehouse_id, first, prev, next);
    },
    warehouseInventoriesByProductId: (root, { product_id, first, next, prev }, context, info) => {
      return warehouseInventoryService.findByProductId(product_id, first, prev, next);
    },
    warehouseInventoriesByWarehouseProductId: (root, { warehouse_id, product_id }, context, info) => {
      return warehouseInventoryService.findByWarehouseProductId(warehouse_id, product_id);
    },
    totalValueOfProductAtWarehouse: (root, { warehouse_id, product_id }, context, info) => {
      return warehouseInventoryService.totalValueOfProductAtWarehouse(warehouse_id, product_id);
    },
  },
  Mutation: {
    createWarehouseInventory: (root, { WarehouseInventoryReq }, context, info) => {
      return warehouseInventoryService.createWarehouseInventory(WarehouseInventoryReq);
    },
    editWarehouseInventory: (root, { id, WarehouseInventoryReq }, context, info) => {
      return warehouseInventoryService.editWarehouseInventory(id, WarehouseInventoryReq);
    },
    removeWarehouseInventory: (root, { id }, context, info) => {
      return warehouseInventoryService.removeWarehouseInventory(id);
    },
  },
};

module.exports = {
  typeDefs,
  resolver,
};