import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

// Import utilities and models
import { calculateCarbonFootprint } from './utils/carbonFootprint.js';
import { calculateRewardPoints } from './utils/rewardPoints.js';
import Product from './models/Product.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
mkdirSync(uploadsDir, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    setTimeout(connectToMongoDB, 5000);
  }
};

connectToMongoDB();
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Reconnecting...');
  connectToMongoDB();
});

// Ensure DB connection before proceeding with requests
const ensureDbConnection = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectToMongoDB();
  }
  next();
};

// Debug Route
app.get('/api/status', async (req, res) => {
  const status = {
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  };
  res.json(status);
});

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/user', userRoutes);
app.use('/checkout', checkoutRoutes);

// API to add new products
app.post('/api/products', ensureDbConnection, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, material, weight, sizeFactor, price } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const carbonFootprint = await calculateCarbonFootprint(material, parseFloat(weight), parseFloat(sizeFactor));
    const rewardPoints = calculateRewardPoints({ carbonFootprint });

    const product = new Product({
      name, category, description, material,
      weight: parseFloat(weight),
      sizeFactor: parseFloat(sizeFactor),
      price: parseFloat(price),
      imageUrl, carbonFootprint, rewardPoints
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// Search products by query
app.get('/api/products/search', ensureDbConnection, async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);
    if (!query || query.trim().length === 0) return res.json([]);
    
    console.log('🔎 Searching for:', query);
    const searchRegex = new RegExp(query.trim(), 'i');

    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { material: searchRegex }
      ]
    }).select('-__v').lean().exec();

    console.log(`✅ Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: 'Failed to search products', details: error.message });
  }
});

// Fetch products by category
app.get('/api/products/:category', ensureDbConnection, async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).select('-__v').lean().exec();
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Default Home Route
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Fetch all products
app.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Fetch product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
