const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const corsMiddleware = require('./middleware/corsMiddleware')
const waterSaleRoutes = require('./routes/waterSaleRoutes')

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());




module.exports = app;