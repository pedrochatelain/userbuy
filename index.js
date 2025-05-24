require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database.mongodb');
const { registerRoutes } = require('./src/config/routes');
const { syntaxErrorHandler } = require('./src/middlewares/handleSyntaxError');
const { setupSwagger } = require('./src/config/swagger');

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
async function startServer() {
  try {
    await connectDB();
    console.log('Database initialized successfully');

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
