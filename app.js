require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const importJobRoutes = require('./routes/importJobRoutes');
const exportJobRoutes = require('./routes/exportJobRoutes');
const productCatalogRoutes = require('./routes/productCatalogRoutes');
const productOfferingRoutes = require('./routes/productOfferingRoutes');
const productSpecificationRoutes = require('./routes/productSpecificationRoutes');
const productOfferingPriceRoutes = require('./routes/productOfferingPriceRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Log requests (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body);
  }
  next();
});

// API Routes
app.use('/api', importJobRoutes);
app.use('/api', exportJobRoutes);
app.use('/api', productCatalogRoutes);
app.use('/api', productOfferingRoutes);
app.use('/api', productSpecificationRoutes);
app.use('/api', productOfferingPriceRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

startServer();