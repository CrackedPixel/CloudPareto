const BaseService = require('./base.service');
const ProductService = require('./product.service');
const { Models, table } = require('../index');

class WarehouseInventoryService extends BaseService {
  constructor () {
    super(Models.WarehouseInventory);
  };

  async createWarehouseInventory (WarehouseInventoryReq) {
    const transaction = {};

    // check for new and return instead
    const exisingWarehouseInventory = await this.findByWarehouseProductId(WarehouseInventoryReq.warehouse_id, WarehouseInventoryReq.product_id);
    if (exisingWarehouseInventory) {
      return await this.editWarehouseInventory(exisingWarehouseInventory.id, WarehouseInventoryReq);
    }

    const newWarehouseInventory = await Models.WarehouseInventory.create(WarehouseInventoryReq, { transaction });
    await table.transact('write', transaction);

    return newWarehouseInventory;
  };

  async editWarehouseInventory (id, WarehouseInventoryReq) {
    const transaction = {};

    const exisingWarehouse = await this.findById(id);
    if (exisingWarehouse) {
      if (
        WarehouseInventoryReq
        && WarehouseInventoryReq.warehouseInventory_id
        && exisingWarehouse.warehouseInventory_id !== WarehouseInventoryReq.warehouseInventory_id
      ) {
        throw new Error('Warehouse ID must be unique.');
      }
    }

    await Models.WarehouseInventory.update({id }, { set: WarehouseInventoryReq, transaction });
    await table.transact('write', transaction);

    return await this.findById(id);
  };

  async removeWarehouseInventory (id) {
    const transaction = {};

    const existingWarehouseInventory = await this.findById(id);

    await Models.WarehouseInventory.remove({ id }, { transaction });
    await table.transact('write', transaction);

    return existingWarehouseInventory;
  };

  async findByWarehouseId (warehouse_id, first, next, prev, additionalParams = {}) {
    let limit = first || 100;
    let nextPage = next;
    let prevPage = prev;
    if (nextPage) {
      nextPage = JSON.parse(nextPage);
    }

    if (prevPage) {
      prevPage = JSON.parse(prevPage);
    }

    const results = await Models.WarehouseInventory.find({ warehouse_id }, { index: 'gs1', limit, next: nextPage, prev: prevPage, ...additionalParams });

    return {
      next: results.next ? JSON.stringify(results.next) : null,
      prev: results.prev ? JSON.stringify(results.prev) : null,
      results,
    };
  }

  async findByWarehouseProductId (warehouse_id, product_id, additionalParams = {}) {
    return await Models.WarehouseInventory.get({ warehouse_id, product_id }, { index: 'gs1', ...additionalParams });
  }

  async findByProductId (product_id, first, next, prev, additionalParams = {}) {
    let limit = first || 100;
    let nextPage = next;
    let prevPage = prev;
    if (nextPage) {
      nextPage = JSON.parse(nextPage);
    }

    if (prevPage) {
      prevPage = JSON.parse(prevPage);
    }

    const results = await Models.WarehouseInventory.find({ product_id }, { where: '${inventory} > {0}', index: 'gs2', limit, next: nextPage, prev: prevPage, ...additionalParams });

    return {
      next: results.next ? JSON.stringify(results.next) : null,
      prev: results.prev ? JSON.stringify(results.prev) : null,
      results,
    };
  }

  async totalValueOfProductAtWarehouse (warehouse_id, product_id) {
    const productInfo = await ProductService.findByProductId(product_id);
    const warehouseStock = await Models.WarehouseInventory.get({ warehouse_id, product_id }, { index: 'gs1' });

    const result = {
      price: productInfo.price,
      inventory: warehouseStock.inventory,
      total: productInfo.price * warehouseStock.inventory,
    };

    return result;
  }
};

module.exports = new WarehouseInventoryService();