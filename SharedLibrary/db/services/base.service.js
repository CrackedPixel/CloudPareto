class BaseService {
  constructor (model) {
    this.model = model;
  };

  async findById(id) {
    return await this.model.get({ id });
  };

  async findByIds(ids) {
    return await this.model.get({ id: ids });
  };

  async findAll(first, next, prev) {
    first = first || 100;
    let nextPage = next;
    let prevPage = prev;
    if (nextPage) {
      nextPage = JSON.parse(nextPage);
    }

    if (prevPage) {
      prevPage = JSON.parse(prevPage);
    }

    const results = await this.model.find({ }, { index: 'gs1', limit: first, next: nextPage, prev: prevPage });

    return {
      next: results.next ? JSON.stringify(results.next) : null,
      prev: results.prev ? JSON.stringify(results.prev) : null,
      results,
    };
  };
};

module.exports = BaseService;
