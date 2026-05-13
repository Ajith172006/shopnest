const express = require('express');
const cors = require('cors');

// Load .env.local only in development (Render uses system env vars in production)
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not needed in production
}

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      /\.vercel\.app$/,          // Any Vercel preview/production URL
      /\.onrender\.com$/,        // Render URLs
    ]
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

const { connectDB } = require('./config/mongodb');

// Import routes
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const usersRoute = require('./routes/users');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (isAllowed) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/users', usersRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await require('./config/mongodb').disconnectDB();
    process.exit(0);
  });
});

module.exports = app;
