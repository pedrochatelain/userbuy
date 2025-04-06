const productRoutes = require('./productRoutes');

module.exports = (app) => {
  app.use('/api/products', productRoutes);
};
