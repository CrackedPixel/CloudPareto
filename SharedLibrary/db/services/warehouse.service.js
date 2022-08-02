const BaseService = require('./base.service');
const { Models, table } = require('../index');

class WarehouseService extends BaseService {
  constructor () {
    super(Models.Warehouse);
  };

  async createWarehouse (warehouseReq) {
    const transaction = {};

    // check for new and return instead
    const exisingWarehouse = await this.findByWarehouseId(warehouseReq.warehouse_id);
    if (exisingWarehouse) {
      return await this.editWarehouse(exisingWarehouse.id, warehouseReq);
    }

    const newWarehouse = await Models.Warehouse.create(warehouseReq, { transaction });
    await table.transact('write', transaction);

    return newWarehouse;
  };

  async editWarehouse (id, warehouseReq) {
    const transaction = {};

    const exisingWarehouse = await this.findById(id);
    if (exisingWarehouse) {
      if (
        warehouseReq
        && warehouseReq.warehouse_id
        && exisingWarehouse.warehouse_id !== warehouseReq.warehouse_id
      ) {
        throw new Error('Warehouse ID must be unique.');
      }
    }

    await Models.Warehouse.update({ id }, { set: warehouseReq, transaction });
    await table.transact('write', transaction);

    return await this.findById(id);
  };

  async removeWarehouse (id) {
    const transaction = {};

    const existingWarehouse = await this.findById(id);

    await Models.Warehouse.remove({ id }, { transaction });
    await table.transact('write', transaction);

    return existingWarehouse;
  };

  async findByWarehouseId (warehouseId, additionalParams = {}) {
    return await Models.Warehouse.get({ warehouse_id: warehouseId }, { index: 'gs2', ...additionalParams });
  }
};

module.exports = new WarehouseService();