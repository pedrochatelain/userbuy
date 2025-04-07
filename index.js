const express = require('express');
const app = express();
const port = 3000;
const registerRoutes = require('./routes'); // points to routes/index.js
const mongo = require('./datasources/mongo.js');

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

registerRoutes(app);
mongo.connectDB()

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
