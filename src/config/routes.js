const productsRoutes = require('../features/product/product.routes');
const userRoutes = require('../features/user/user.routes');
const purchaseRoutes = require('../features/purchase/purchase.routes');
const loginRoutes = require('../features/login/login.routes');

function registerRoutes(app) {
  app.get('/', (req, res) => res.send('Hello World!'));
  app.use(productsRoutes);
  app.use(userRoutes);
  app.use(purchaseRoutes);
  app.use(loginRoutes);
}

module.exports = { registerRoutes };
