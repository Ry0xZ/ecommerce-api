const Product = require('../models/Product');

class ProductDAO {
  create(data) {
    return Product.create(data);
  }

  findById(id) {
    return Product.findById(id);
  }

  find(query = {}, options = {}) {
    return Product.find(query, null, options);
  }

  paginate(query = {}, options = {}) {
    return Product.paginate(query, options);
  }

  updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id) {
    return Product.findByIdAndDelete(id);
  }

  decStock(id, qty) {
    return Product.findOneAndUpdate(
      { _id: id, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    );
  }
}

module.exports = new ProductDAO();