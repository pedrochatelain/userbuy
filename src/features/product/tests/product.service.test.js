const service = require('../product.service');
const datasource = require('../product.datasource');
const { GoogleGenAI } = require('@google/genai');
const { ProductsNotFound, ProductRejectedByAI } = require('../../../errors/customErrors');
const getPromptFromSecretFile = require('../../../config/getPromptFromSecretFile');

jest.mock('../product.datasource.js');
jest.mock('@google/genai');
jest.mock('../../../config/getPromptFromSecretFile');

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should add a product if AI approves', async () => {
      const mockProduct = { name: 'Laptop', category: 'Electronics' };

      // Mock AI and datasource behaviors
      GoogleGenAI.prototype.models = {
        generateContent: jest.fn().mockResolvedValue({ text: '{"issues": {}}' }),
      };
      getPromptFromSecretFile.mockResolvedValue('Prompt with ${product.name} and ${product.category}');
      datasource.addProduct.mockResolvedValue();

      await expect(service.addProduct(mockProduct)).resolves.not.toThrow();
      expect(datasource.addProduct).toHaveBeenCalledWith(mockProduct);
    });

    it('should reject a product if AI detects issues', async () => {
      const mockProduct = { name: 'Phone', category: 'Electronics' };
      GoogleGenAI.prototype.models = {
        generateContent: jest.fn().mockResolvedValue({
          text: '{"issues": {"name": "Invalid name"}}',
        }),
      };
      getPromptFromSecretFile.mockResolvedValue('Prompt with ${product.name} and ${product.category}');

      await expect(service.addProduct(mockProduct)).rejects.toThrow(ProductRejectedByAI);
      expect(datasource.addProduct).not.toHaveBeenCalled();
    });
  });

  describe('getProducts', () => {
    it('should return products based on query parameters', async () => {
      const mockQueryParams = { category: 'Electronics' };
      const mockProducts = [{ name: 'Laptop' }, { name: 'Phone' }];

      datasource.getProducts.mockResolvedValue(mockProducts);

      const result = await service.getProducts(mockQueryParams);

      expect(result).toEqual(mockProducts);
      expect(datasource.getProducts).toHaveBeenCalledWith(mockQueryParams);
    });

    it('should throw an error if datasource fails', async () => {
      datasource.getProducts.mockRejectedValue(new Error('Datasource error'));

      await expect(service.getProducts({})).rejects.toThrow('Datasource error');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product if it exists', async () => {
      const mockProduct = { id: '123' };

      datasource.getProductById.mockResolvedValue(mockProduct);
      datasource.deleteProduct.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct('123');

      expect(result).toEqual(mockProduct);
      expect(datasource.deleteProduct).toHaveBeenCalledWith('123');
    });

    it('should throw ProductsNotFound if product does not exist', async () => {
      datasource.getProductById.mockResolvedValue(null);

      await expect(service.deleteProduct('123')).rejects.toThrow(ProductsNotFound);
    });
  });

  describe('updateProduct', () => {
    it('should update a product if it exists', async () => {
      const mockUpdatedProduct = { id: '123', name: 'Updated Laptop' };

      datasource.updateProduct.mockResolvedValue(mockUpdatedProduct);

      const result = await service.updateProduct('123', { name: 'Updated Laptop' });

      expect(result).toEqual(mockUpdatedProduct);
      expect(datasource.updateProduct).toHaveBeenCalledWith('123', { name: 'Updated Laptop' });
    });

    it('should throw ProductsNotFound if product does not exist', async () => {
      datasource.updateProduct.mockResolvedValue(null);

      await expect(service.updateProduct('123', { name: 'Updated Laptop' })).rejects.toThrow(ProductsNotFound);
    });
  });
});
