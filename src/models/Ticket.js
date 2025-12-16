const { Schema, model } = require('mongoose');

const TicketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true } // email o userId
}, { versionKey: false });

module.exports = model('Ticket', TicketSchema);