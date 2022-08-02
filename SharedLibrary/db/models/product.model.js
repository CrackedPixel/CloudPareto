const ProductModel = {
  PK: { type: String, value: 'product:${id}'},
  SK: { type: String, value: 'product:' },
  id: { type: String, generate: 'ulid', validate: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i },

  product_id: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  cost: { type: Number, required: true },
  price: { type: Number, required: true },

  GS1PK: { type: String, value: 'product:' },
  GS1SK: { type: String, value: 'productid:${product_id}' },

  GS2PK: { type: String, value: 'productid:${product_id}' },
  GS2SK: { type: String, value: 'product:' },
};

module.exports = ProductModel;