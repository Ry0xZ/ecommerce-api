const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  password: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model('User', userSchema);