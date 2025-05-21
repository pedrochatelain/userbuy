const {
  addPurchase,
  getPurchases,
  getPurchasesUser,
  deletePurchase,
  getPurchase,
} = require('../purchase.service');
const datasourceUser = require('../../user/user.datasource');
const datasourceProduct = require('../../product/product.datasource');
const datasourcePurchase = require('../purchase.datasource');
const {
  UserNotFound,
  ProductsNotFound,
  InsufficientFunds,
} = require('../../../errors/customErrors');

jest.mock('../../user/user.datasource');
jest.mock('../../product/product.datasource');
jest.mock('../purchase.datasource');

describe('Purchase Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addPurchase', () => {
    it('should successfully add a purchase', async () => {
      const purchase = { idUser: '64e3a9f8f8d4f2b4baccafff', idProduct: '64e3b1a9f9d4f2c5baccb000' };
      const user = { balances: 2000 };
      const product = { price: 1000 };
      const purchaseResult = { idUser: purchase.idUser, product };

      datasourceUser.getUser.mockResolvedValue(user);
      datasourceProduct.getProductById.mockResolvedValue(product);
      datasourcePurchase.purchase.mockResolvedValue(purchaseResult);

      await expect(addPurchase(purchase)).resolves.toEqual(purchaseResult);

      expect(datasourceUser.getUser).toHaveBeenCalledWith(purchase.idUser);
      expect(datasourceProduct.getProductById).toHaveBeenCalledWith(purchase.idProduct);
      expect(datasourcePurchase.purchase).toHaveBeenCalledWith(purchase.idUser, product);
    });

    it('should throw UserNotFound if user does not exist', async () => {
      const purchase = { idUser: '64e3a9f8f8d4f2b4baccafff', idProduct: '64e3b1a9f9d4f2c5baccb000' };

      datasourceUser.getUser.mockResolvedValue(null);

      await expect(addPurchase(purchase)).rejects.toThrow(UserNotFound);

      expect(datasourceUser.getUser).toHaveBeenCalledWith(purchase.idUser);
      expect(datasourceProduct.getProductById).not.toHaveBeenCalled();
      expect(datasourcePurchase.purchase).not.toHaveBeenCalled();
    });

    it('should throw ProductsNotFound if product does not exist', async () => {
      const purchase = { idUser: '64e3a9f8f8d4f2b4baccafff', idProduct: '64e3b1a9f9d4f2c5baccb000' };
      const user = { balances: 2000 };

      datasourceUser.getUser.mockResolvedValue(user);
      datasourceProduct.getProductById.mockResolvedValue(null);

      await expect(addPurchase(purchase)).rejects.toThrow(ProductsNotFound);

      expect(datasourceUser.getUser).toHaveBeenCalledWith(purchase.idUser);
      expect(datasourceProduct.getProductById).toHaveBeenCalledWith(purchase.idProduct);
      expect(datasourcePurchase.purchase).not.toHaveBeenCalled();
    });

    it('should throw InsufficientFunds if user has insufficient funds', async () => {
      const purchase = { idUser: '64e3a9f8f8d4f2b4baccafff', idProduct: '64e3b1a9f9d4f2c5baccb000' };
      const user = { balances: 500 };
      const product = { price: 1000 };

      datasourceUser.getUser.mockResolvedValue(user);
      datasourceProduct.getProductById.mockResolvedValue(product);

      await expect(addPurchase(purchase)).rejects.toThrow(InsufficientFunds);

      expect(datasourceUser.getUser).toHaveBeenCalledWith(purchase.idUser);
      expect(datasourceProduct.getProductById).toHaveBeenCalledWith(purchase.idProduct);
      expect(datasourcePurchase.purchase).not.toHaveBeenCalled();
    });
  });

  describe('getPurchases', () => {
    it('should retrieve all purchases', async () => {
      const purchases = [{ idUser: '64e3a9f8f8d4f2b4baccafff', product: { price: 1000 } }];
      datasourcePurchase.getPurchases.mockResolvedValue(purchases);

      await expect(getPurchases()).resolves.toEqual(purchases);

      expect(datasourcePurchase.getPurchases).toHaveBeenCalled();
    });
  });

  describe('getPurchasesUser', () => {
    it('should retrieve purchases for a specific user', async () => {
      const idUser = '64e3a9f8f8d4f2b4baccafff';
      const purchases = [{ idUser, product: { price: 1000 } }];
      datasourcePurchase.getPurchasesUser.mockResolvedValue(purchases);

      await expect(getPurchasesUser(idUser)).resolves.toEqual(purchases);

      expect(datasourcePurchase.getPurchasesUser).toHaveBeenCalledWith(idUser);
    });
  });

  describe('deletePurchase', () => {
    it('should delete a purchase and return the deleted purchase', async () => {
      const idPurchase = '64e3b1a9f9d4f2c5baccb000';
      const deletedPurchase = { idUser: '64e3a9f8f8d4f2b4baccafff', product: { price: 1000 } };

      datasourcePurchase.deletePurchase.mockResolvedValue(deletedPurchase);

      await expect(deletePurchase(idPurchase)).resolves.toEqual(deletedPurchase);

      expect(datasourcePurchase.deletePurchase).toHaveBeenCalledWith(idPurchase);
    });

    it('should throw an error if purchase does not exist', async () => {
      const idPurchase = '64e3b1a9f9d4f2c5baccb000';
      datasourcePurchase.deletePurchase.mockResolvedValue(null);

      await expect(deletePurchase(idPurchase)).rejects.toThrow('Purchase not found');

      expect(datasourcePurchase.deletePurchase).toHaveBeenCalledWith(idPurchase);
    });
  });

  describe('getPurchase', () => {
    it('should retrieve a purchase by ID', async () => {
      const idPurchase = '64e3b1a9f9d4f2c5baccb000';
      const purchase = { idUser: '64e3a9f8f8d4f2b4baccafff', product: { price: 1000 } };

      datasourcePurchase.getPurchase.mockResolvedValue(purchase);

      await expect(getPurchase(idPurchase)).resolves.toEqual(purchase);

      expect(datasourcePurchase.getPurchase).toHaveBeenCalledWith(idPurchase);
    });

    it('should return null if an error occurs', async () => {
      const idPurchase = '64e3b1a9f9d4f2c5baccb000';

      datasourcePurchase.getPurchase.mockRejectedValue(new Error('Database error'));

      await expect(getPurchase(idPurchase)).resolves.toBeNull();

      expect(datasourcePurchase.getPurchase).toHaveBeenCalledWith(idPurchase);
    });
  });
});
