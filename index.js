const express = require('express');
const app = express();
const port = 3000;
const validateProduct = require('./middlewares/productValidator');
const { validationResult } = require('express-validator');

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/products', validateProduct, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const product = req.body;
  console.log('Received product:', product);
  res.status(200).json({ message: 'Product added successfully', product });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
