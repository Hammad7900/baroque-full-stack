require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Product, Order } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const seedProducts = [
  // UNSTITCHED
  { title: "EMBROIDERED NET CH-12", sku: "CH-12", price: 18990, category: "Unstitched", fabric: "Net", images: ["https://images.unsplash.com/photo-1627335064500-619f7278d655?ixlib=rb-4.0.3&w=800&q=80"], stock: 50, isLive: true, description: "Premium unstitched net fabric with heavy embroidery." },
  { title: "LAWN SWISS SW-05", sku: "SW-05", price: 9990, category: "Unstitched", fabric: "Lawn", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&w=800&q=80"], stock: 30, isLive: true, description: "Breezy swiss lawn perfect for summer." },
  { title: "PRINTED KHADDAR PR-19", sku: "PR-19", price: 6590, category: "Unstitched", fabric: "Khaddar", images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&w=800&q=80"], stock: 100, isLive: true, description: "Warm khaddar with vibrant digital prints." },
  { title: "LUXURY LAWN LC-08", sku: "LC-08", price: 11500, category: "Unstitched", fabric: "Lawn", images: ["https://images.unsplash.com/photo-1605763240000-7e93b172d754?ixlib=rb-4.0.3&w=800&q=80"], stock: 25, isLive: true, description: "Luxury embroidered lawn collection." },
  
  // FORMALS
  { title: "CHIFFON FORMAL UF-42", sku: "UF-42", price: 22500, category: "Formals", fabric: "Chiffon", images: ["https://images.unsplash.com/photo-1583391733958-d25e77f224b5?ixlib=rb-4.0.3&w=800&q=80"], stock: 15, isLive: true, description: "Elegant chiffon for formal events." },
  { title: "ORGANZA OR-03", sku: "OR-03", price: 16990, category: "Formals", fabric: "Organza", images: ["https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&w=800&q=80"], stock: 10, isLive: true, description: "Hand-crafted organza formal dress." },
  { title: "SILK ENSEMBLE SE-01", sku: "SE-01", price: 25000, category: "Formals", fabric: "Silk", images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&w=800&q=80"], stock: 12, isLive: true, description: "Pure raw silk with tilla work." },
  
  // PRET (READY TO WEAR)
  { title: "SOLID CAMBRIC TUNIC", sku: "RTW-01", price: 4500, category: "Ready to Wear", fabric: "Cambric", images: ["https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&w=800&q=80"], stock: 40, isLive: true, description: "Everyday solid tunic." },
  { title: "PRINTED COTTON DRESS", sku: "RTW-02", price: 5500, category: "Ready to Wear", fabric: "Cotton", images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&w=800&q=80"], stock: 35, isLive: true, description: "Stitched printed cotton suit." },
  
  // SHAWLS
  { title: "EMBROIDERED VELVET SHAWL", sku: "VL-01", price: 12900, category: "Shawls", fabric: "Velvet", images: ["https://images.unsplash.com/photo-1608061426466-99cbdfb8f219?ixlib=rb-4.0.3&w=800&q=80"], stock: 45, isLive: true, description: "Heavy embroidered micro-velvet shawl." },
  { title: "PASHMINA SHAWL PS-02", sku: "PS-02", price: 8900, category: "Shawls", fabric: "Pashmina", images: ["https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&w=800&q=80"], stock: 60, isLive: true, description: "Warm pure pashmina shawl." }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/baroque_full')
  .then(async () => {
    console.log('DB Connected');
    if (await Product.countDocuments() === 0) await Product.insertMany(seedProducts);
  }).catch(console.error);

app.get('/api/products', async (req, res) => {
  res.json(await Product.find({ isLive: true }));
});

app.get('/api/products/:id', async (req, res) => {
  try { res.json(await Product.findById(req.params.id)); } 
  catch(e) { res.status(404).json({error: "Not found"}); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, orderId: newOrder._id });
  } catch (error) { res.status(400).json({ error: 'Order failed' }); }
});

app.listen(5000, () => console.log(`API port 5000`));