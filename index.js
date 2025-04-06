const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/products', (req, res) => {
  const product = req.body;
  console.log('Received product:', product);
  res.status(200).json({ message: 'Product added successfully', product });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
