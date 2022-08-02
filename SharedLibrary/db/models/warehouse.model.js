const WarehouseModel = {
  PK: { type: String, value: 'warehouse:${id}'},
  SK: { type: String, value: 'warehouse:' },
  id: { type: String, generate: 'ulid', validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i },

  warehouse_id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  phonenumber: { type: String, required: true },

  GS1PK: { type: String, value: 'warehouse:' },
  GS1SK: { type: String, value: 'warehouseid:${warehouse_id}' },

  GS2PK: { type: String, value: 'warehouseid:${warehouse_id}' },
  GS2SK: { type: String, value: 'warehouse:' },
};

module.exports = WarehouseModel;