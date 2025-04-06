const express = require('express');
const app = express();
const port = 3000;
const registerRoutes = require('./routes'); // points to routes/index.js

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

registerRoutes(app);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
