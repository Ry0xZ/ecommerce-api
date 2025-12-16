const cartDAO = require('../daos/cart.dao');

class CartRepository {
  getById(id) {
    return cartDAO.findById(id);
  }

  setProducts(cid, products) {
    return cartDAO.updateProducts(cid, products);
  }
}

module.exports = new CartRepository();