const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const applianceRoutes = require('./routes/applianceRoutes');
const usageRoutes = require('./routes/usageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/appliances', authMiddleware, applianceRoutes);
app.use('/api/usage', authMiddleware, usageRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'SmartWatts API', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SmartWatts API running on port ${PORT}`);
  });
});
