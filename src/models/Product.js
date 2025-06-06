const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: { type: String, unique: true },
  stock: Number,
  status: { type: Boolean, default: true },
  category: String
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;