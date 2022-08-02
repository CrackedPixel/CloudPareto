const validators = {
  Query: {
    productById: (resolve, root, args, context) => {
      const { id } = args;

      if (!id && id !== 0) {
        throw new Error('Missing required field: id.');
      }

      return resolve(root, args, context);
    },
    products: (resolve, root, args, context) => {
      const { first, offset } = args;

      if (first && !(first >= 1 && first <= 100)) {
        throw new Error('You can only query 100 results in a request.');
      }

      if (offset && offset < 1) {
        throw new Error('Offset must be a positive number.');
      }

      return resolve(root, args, context);
    },
  },
};

module.exports = {
  validators,
};
