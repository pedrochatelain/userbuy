const express = require('express');
const app = express();
const { connectDB } = require('./src/config/mongoConnection.js');
const productsRoutes = require('./src/features/product/product.routes.js');
const userRoutes = require('./src/features/user/user.routes.js');
const purchaseRoutes = require('./src/features/purchase/purchase.routes.js');
const loginRoutes = require('./src/features/login/login.routes.js');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swagger.js");

// Swagger setup
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(productsRoutes)
app.use(userRoutes)
app.use(purchaseRoutes)
app.use(loginRoutes)

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
