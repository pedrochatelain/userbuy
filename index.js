const express = require('express');
const app = express();
const port = 3000;
const mongo = require('./datasources/mongo.js');
const productsRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const purchaseRoutes = require('./routes/purchaseRoutes.js');

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(productsRoutes)
app.use(userRoutes)
app.use(purchaseRoutes)

mongo.connectDB()

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
