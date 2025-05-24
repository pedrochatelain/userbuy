require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { registerRoutes } = require('./src/config/routes');
const { syntaxErrorHandler } = require('./src/middlewares/handleSyntaxError');
const { setupSwagger } = require('./src/config/swagger');
const { startServer } = require('./src/config/server')

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Setup Swagger
setupSwagger(app);

// Register Routes
registerRoutes(app);

// Error-handling middleware
app.use(syntaxErrorHandler);

// Connect to Database and Start Server
startServer(app);
