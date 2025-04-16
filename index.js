const express = require('express');
const app = express();
const port = 3000;
const { connectDB } = require('./datasources/mongoConnection.js');
const productsRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const purchaseRoutes = require('./routes/purchaseRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js');

// Middleware to parse JSON
app.use(express.json());

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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
