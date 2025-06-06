const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.model('Cart', cartSchema);