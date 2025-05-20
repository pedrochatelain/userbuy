const { ObjectId } = require('mongodb');
const { 
    addProduct, 
    updateProduct, 
    getProducts, 
    deleteProduct, 
    getProductById 
} = require('../product.datasource');

jest.mock('../../../config/database.mongodb.js', () => ({
    getDb: jest.fn()
}));

const { getDb } = require('../../../config/database.mongodb.js');

describe('Datasource Tests', () => {
    let mockCollection;

    beforeEach(() => {
        mockCollection = {
            insertOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            find: jest.fn(),
            findOneAndDelete: jest.fn(),
            findOne: jest.fn()
        };

        getDb.mockReturnValue({
            collection: jest.fn().mockReturnValue(mockCollection)
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('addProduct should insert a product', async () => {
        const product = { name: 'Product A', price: 100 };
        mockCollection.insertOne.mockResolvedValue({ acknowledged: true });

        await addProduct(product);

        expect(mockCollection.insertOne).toHaveBeenCalledWith(product);
    });

    test('updateProduct should update a product and return the updated document', async () => {
        const idProduct = new ObjectId().toHexString();
        const productUpdate = { price: 150 };

        const updatedProduct = { _id: idProduct, ...productUpdate };
        mockCollection.findOneAndUpdate.mockResolvedValue({ value: updatedProduct });

        const result = await updateProduct(idProduct, productUpdate);

        expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: new ObjectId(idProduct) },
            { $set: productUpdate },
            { returnDocument: 'after' }
        );
        expect(result).toEqual({ value: updatedProduct });
    });

    test('getProducts should return products matching the query', async () => {
        const queryParams = { price: '100', name: 'Product A' };
        const query = { price: 100, name: 'Product A' };

        const products = [
            { _id: new ObjectId(), name: 'Product A', price: 100 }
        ];

        mockCollection.find.mockReturnValue({
            toArray: jest.fn().mockResolvedValue(products)
        });

        const result = await getProducts(queryParams);

        expect(mockCollection.find).toHaveBeenCalledWith(query);
        expect(result).toEqual(products);
    });

    test('deleteProduct should delete a product by ID', async () => {
        const idProduct = new ObjectId().toHexString();
        const deletedProduct = { _id: idProduct, name: 'Product A', price: 100 };

        mockCollection.findOneAndDelete.mockResolvedValue({ value: deletedProduct });

        const result = await deleteProduct(idProduct);

        expect(mockCollection.findOneAndDelete).toHaveBeenCalledWith({
            _id: ObjectId.createFromHexString(idProduct)
        });
        expect(result).toEqual({ value: deletedProduct });
    });

    test('getProductById should return a product by ID', async () => {
        const id = new ObjectId().toHexString();
        const product = { _id: id, name: 'Product A', price: 100 };

        mockCollection.findOne.mockResolvedValue(product);

        const result = await getProductById(id);

        expect(mockCollection.findOne).toHaveBeenCalledWith({
            _id: ObjectId.createFromHexString(id)
        });
        expect(result).toEqual(product);
    });

    test('getProductById should return null for an invalid ID', async () => {
        const invalidId = 'invalid-id';

        const result = await getProductById(invalidId);

        expect(result).toBeNull();
        expect(mockCollection.findOne).not.toHaveBeenCalled();
    });
});
