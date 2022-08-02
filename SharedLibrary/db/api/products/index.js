const fs = require('fs');
const productService = require('../../services/product.service');
const typeDefs = fs.readFileSync(`${__dirname}/product.graphql`).toString();

const resolver = {
  Query: {
    productById: (root, { id }, context, info) => {
      return productService.findById(id);
    },
    products: (root, { first, next, prev }, context, info) => {
      return productService.findAll(first, next, prev);
    },
    productByProductId: (root, { productId }, context, info) => {
      return productService.findByProductId(productId);
    }
  },
  Mutation: {
    createProduct: (root, { productReq }, context, info) => {
      return productService.createProduct(productReq);
    },
    editProduct: (root, { id, productReq }, context, info) => {
      return productService.editProduct(id, productReq);
    },
    removeProduct: (root, { id }, context, info) => {
      return productService.removeProduct(id);
    },
  },
};

module.exports = {
  typeDefs,
  resolver,
};