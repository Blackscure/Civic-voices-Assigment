require('dotenv').config();
const app = require('./app');
const mongoose = require('./config/db');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));