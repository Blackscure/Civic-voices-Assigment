const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const corsMiddleware = require('./middleware/corsMiddleware')
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

app.use('/apps/todo-list/api/v1/authentication', authRoutes);
app.use('/apps/todo-list/api/v1/todos', todoRoutes);

module.exports = app;