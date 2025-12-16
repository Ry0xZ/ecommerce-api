const Cart = require('../models/Cart');

class CartDAO {
  findById(id) {
    return Cart.findById(id).lean();
  }

  updateProducts(cid, products) {
    return Cart.findByIdAndUpdate(cid, { products }, { new: true }).lean();
  }
}

module.exports = new CartDAO();