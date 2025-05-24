const express = require('express');
const app = express();
const { connectDB } = require('./src/config/database.mongodb.js');
const cors = require('cors');
const { registerRoutes } = require('./src/config/routes');
const { setupSwagger } = require('./src/config/swagger');
const { syntaxErrorHandler } = require('./src/middlewares/handleSyntaxError.js');


// Swagger setup
setupSwagger(app)

// Middleware to parse JSON
app.use(express.json());

// Error-handling middleware
app.use(syntaxErrorHandler);

// Enable CORS
app.use(cors());

registerRoutes(app)

require('dotenv').config();


async function connectToDatabase() {
  try {
    await connectDB();
    console.log('Database initialized successfully');
    // Add your server initialization code here
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

connectToDatabase();

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
