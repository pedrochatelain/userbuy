const { purchase, getPurchases, getPurchasesUser, deletePurchase, getPurchase } = require('../purchase.datasource');
const datasourceUser = require('../../user/user.datasource');
const { getDb } = require('../../../config/database.mongodb');
const { ObjectId } = require('mongodb');

jest.mock('../../../config/database.mongodb', () => ({
  getDb: jest.fn(),
}));

jest.mock('../../user/user.datasource', () => ({
  addToBalances: jest.fn(),
}));

describe('Purchases DataSource', () => {
  let mockDb, mockPurchasesCollection;

  beforeEach(() => {
    mockPurchasesCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
      findOneAndDelete: jest.fn(),
      client: { startSession: jest.fn(() => mockSession) },
    };

    mockDb = { collection: jest.fn(() => mockPurchasesCollection) };
    getDb.mockReturnValue(mockDb);

    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('purchase', () => {
    it('should create a purchase and update user balance', async () => {
      const idUser = '64e3a9f8f8d4f2b4baccafff';
      const product = { name: 'Laptop', price: 1000 };

      mockPurchasesCollection.insertOne.mockResolvedValue({ insertedId: '64e3b1a9f9d4f2c5baccb000' });
      mockPurchasesCollection.findOne.mockResolvedValue({ _id: '64e3b1a9f9d4f2c5baccb000', idUser, product });

      await expect(purchase(idUser, product)).resolves.toEqual({
        _id: '64e3b1a9f9d4f2c5baccb000',
        idUser,
        product,
      });

      expect(mockPurchasesCollection.insertOne).toHaveBeenCalledWith(
        { idUser: new ObjectId(idUser), product, purchaseDate: expect.any(Date) },
        { session: mockSession }
      );

      expect(datasourceUser.addToBalances).toHaveBeenCalledWith(idUser, -product.price, mockSession);
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it('should abort the transaction if an error occurs', async () => {
      const idUser = '64e3a9f8f8d4f2b4baccafff';
      const product = { name: 'Laptop', price: 1000 };

      mockPurchasesCollection.insertOne.mockRejectedValue(new Error('Insertion failed'));

      await expect(purchase(idUser, product)).rejects.toThrow('Insertion failed');
      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
  });

  describe('deletePurchase', () => {
    it('should delete a purchase and update user balance', async () => {
      const idPurchase = '64e3b1a9f9d4f2c5baccb000';
      const purchase = { idUser: new ObjectId('64e3a9f8f8d4f2b4baccafff'), product: { price: 1000 } };

      mockPurchasesCollection.findOne.mockResolvedValue(purchase);
      mockPurchasesCollection.findOneAndDelete.mockResolvedValue({ value: purchase });

      await expect(deletePurchase(idPurchase)).resolves.toEqual({ value: purchase });

      expect(mockPurchasesCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId(idPurchase) });
      expect(datasourceUser.addToBalances).toHaveBeenCalledWith(
        purchase.idUser,
        purchase.product.price,
        mockSession
      );
      expect(mockPurchasesCollection.findOneAndDelete).toHaveBeenCalledWith({
        _id: new ObjectId(idPurchase),
      });
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('getPurchases', () => {
    it('should retrieve all purchases', async () => {
      const purchases = [{ idUser: new ObjectId('64e3a9f8f8d4f2b4baccafff'), product: { price: 1000 } }];
      mockPurchasesCollection.find().toArray.mockResolvedValue(purchases);

      await expect(getPurchases()).resolves.toEqual(purchases);

      expect(mockPurchasesCollection.find).toHaveBeenCalled();
    });
  });

  describe('getPurchasesUser', () => {
    it('should retrieve all purchases for a user', async () => {
      const idUser = '64e3a9f8f8d4f2b4baccafff';
      const purchases = [{ idUser: new ObjectId(idUser), product: { price: 1000 } }];
      mockPurchasesCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(purchases) });

      await expect(getPurchasesUser(idUser)).resolves.toEqual(purchases);

      expect(mockPurchasesCollection.find).toHaveBeenCalledWith({ idUser: new ObjectId(idUser) });
    });
  });

  describe('getPurchase', () => {
    it('should retrieve a purchase by ID', async () => {
      const idPurchase = '64e3b1a9f9d4f2c5baccb000';
      const purchase = { idUser: new ObjectId('64e3a9f8f8d4f2b4baccafff'), product: { price: 1000 } };

      mockPurchasesCollection.findOne.mockResolvedValue(purchase);

      await expect(getPurchase(idPurchase)).resolves.toEqual(purchase);

      expect(mockPurchasesCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId(idPurchase) });
    });
  });
});
