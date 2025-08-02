const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['pcs', 'kg'], default: 'pcs' },
  description: String
});

module.exports = mongoose.model('Product', productSchema);

