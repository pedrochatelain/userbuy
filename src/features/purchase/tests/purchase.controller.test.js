const { addPurchase, getPurchases, getPurchasesUser, deletePurchase } = require('../purchase.controller');
const service = require('../purchase.service');

jest.mock('../purchase.service');

describe('Purchase Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('addPurchase', () => {
        it('should return 201 and the created purchase on success', async () => {
            const purchase = { id: 1, item: 'Test Item' };
            service.addPurchase.mockResolvedValue(purchase);

            req.body = { item: 'Test Item' };

            await addPurchase(req, res);

            expect(service.addPurchase).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'added purchase', purchase });
        });

        it('should handle errors and return the correct status code and message', async () => {
            const error = new Error('Test Error');
            service.addPurchase.mockRejectedValue(error);

            await addPurchase(req, res);

            expect(service.addPurchase).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Test Error' });
        });
    });

    describe('getPurchases', () => {
        it('should return 200 and the list of purchases on success', async () => {
            const purchases = [{ id: 1, item: 'Test Item' }];
            service.getPurchases.mockResolvedValue(purchases);

            await getPurchases(req, res);

            expect(service.getPurchases).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(purchases);
        });

        it('should handle errors and return 500 with an error message', async () => {
            service.getPurchases.mockRejectedValue(new Error('Error fetching purchases'));

            await getPurchases(req, res);

            expect(service.getPurchases).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching purchases' });
        });
    });

    describe('getPurchasesUser', () => {
        it('should return 200 and user purchases on success', async () => {
            const userId = '123';
            const purchases = [{ id: 1, item: 'Test Item' }];
            service.getPurchasesUser.mockResolvedValue(purchases);

            req.params.userId = userId;

            await getPurchasesUser(req, res);

            expect(service.getPurchasesUser).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(purchases);
        });

        it('should handle errors and return 500 with an error message', async () => {
            service.getPurchasesUser.mockRejectedValue(new Error('Error fetching user purchases'));

            req.params.userId = '123';

            await getPurchasesUser(req, res);

            expect(service.getPurchasesUser).toHaveBeenCalledWith('123');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching user purchases' });
        });
    });

    describe('deletePurchase', () => {
        it('should return 200 and the deleted purchase on success', async () => {
            const idPurchase = '1';
            const deletedPurchase = { id: 1, item: 'Deleted Item' };
            service.deletePurchase.mockResolvedValue(deletedPurchase);

            req.params.idPurchase = idPurchase;

            await deletePurchase(req, res);

            expect(service.deletePurchase).toHaveBeenCalledWith(idPurchase);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ deletedPurchase });
        });

        it('should handle errors and return the correct status code and message', async () => {
            const error = new Error('Test Error');
            service.deletePurchase.mockRejectedValue(error);

            req.params.idPurchase = '1';

            await deletePurchase(req, res);

            expect(service.deletePurchase).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Test Error' });
        });
    });
});
