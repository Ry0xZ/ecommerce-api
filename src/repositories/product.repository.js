const productDAO = require('../daos/product.dao');

class ProductRepository {
  create(data) {
    return productDAO.create(data);
  }

  getById(id) {
    return productDAO.findById(id);
  }

  list(query, options) {
    return productDAO.find(query, options);
  }

  paginate(query, options) {
    return productDAO.paginate(query, options);
  }

  update(id, data) {
    return productDAO.updateById(id, data);
  }

  delete(id) {
    return productDAO.deleteById(id);
  }

  decStock(id, qty) {
    return productDAO.decStock(id, qty);
  }
}

module.exports = new ProductRepository();