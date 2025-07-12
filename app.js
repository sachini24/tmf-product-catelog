const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();

const importJobRoutes = require('./routes/importJobRoutes');
const exportJobRoutes = require('./routes/exportJobRoutes');
const productCatalogRoutes = require('./routes/productCatalogRoutes');
const productOfferingRoutes = require('./routes/productOfferingRoutes');
const productSpecificationRoutes = require('./routes/productSpecificationRoutes');
const productOfferingPriceRoutes = require('./routes/productOfferingPriceRoutes');

// Connect to DB
connectDB();

// Parse JSON
app.use(express.json());

// Serve static files (if you have any in 'public' folder)
app.use(express.static('public'));

// ✅ Middleware to log POST payloads
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`\n📥 Incoming POST request to ${req.originalUrl}`);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Server is running');
});


// Routes
app.use('/api', importJobRoutes);
app.use('/api', exportJobRoutes);
app.use('/api', productCatalogRoutes);
app.use('/api', productOfferingRoutes);
app.use('/api', productSpecificationRoutes);
app.use('/api', productOfferingPriceRoutes);

// Use dynamic port for deployment platforms
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));