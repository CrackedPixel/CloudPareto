const WarehouseInventoryModel = {
  PK: { type: String, value: 'warehouseinventory:${id}'},
  SK: { type: String, value: 'warehouseinventory:' },
  id: { type: String, generate: 'ulid', validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i },

  warehouse_id: { type: String, required: true },
  product_id: { type: String, required: true },
  inventory: { type: Number, required: true },

  GS1PK: { type: String, value: 'warehouseinventory:warehouse' },
  GS1SK: { type: String, value: 'warehouseinventory:${warehouse_id}' },

  GS2PK: { type: String, value: 'warehouseinventory:product' },
  GS2SK: { type: String, value: 'warehouseinventory:${product_id}' },
};

module.exports = WarehouseInventoryModel;