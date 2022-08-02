const BaseService = require('./base.service');
const { Models, table } = require('../index');

class ProductService extends BaseService {
  constructor () {
    super(Models.Product);
  };

  async createProduct (productReq) {
    const transaction = {};

    // check for new and return instead
    const exisingProduct = await this.findByProductId(productReq.product_id);
    if (exisingProduct) {
      return await this.editProduct(exisingProduct.id, productReq);
    }

    const newProduct = await Models.Product.create(productReq, { transaction });
    await table.transact('write', transaction);

    return newProduct;
  };

  async editProduct (id, productReq) {
    const transaction = {};

    const exisingProduct = await this.findById(id);
    if (exisingProduct) {
      if (
        productReq
        && productReq.product_id
        && exisingProduct.product_id !== productReq.product_id
      ) {
        throw new Error('Product ID must be unique.');
      }
    }

    await Models.Product.update({ id }, { set: productReq, transaction });
    await table.transact('write', transaction);

    return await this.findById(id);
  };

  async removeProduct (id) {
    const transaction = {};

    const existingProduct = await this.findById(id);
    // remove from warehouses?

    await Models.Product.remove({ id }, { transaction });
    await table.transact('write', transaction);

    return existingProduct;
  };

  async findByProductId (productId, additionalParams = {}) {
    return await Models.Product.get({ product_id: productId }, { index: 'gs2', ...additionalParams });
  }
};

module.exports = new ProductService();