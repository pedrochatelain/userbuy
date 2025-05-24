const { connectDB } = require('../config/database.mongodb');

async function startServer(app) {
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

module.exports = { startServer }