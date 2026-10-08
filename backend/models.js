const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title: String, sku: String, price: Number, category: String,
  fabric: String, images: [String], stock: Number, isLive: Boolean, description: String
});
const orderSchema = new mongoose.Schema({
  customerInfo: Object, items: Array, totalAmount: Number, status: { type: String, default: 'Pending' }
});
module.exports = {
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema)
};