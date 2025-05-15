const productPaths = {
  paths: {
    "/api/products": {
      post: {
        summary: "Create a new product",
        tags: ["Products"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  category: { type: "string", example: "categ" },
                  name: { type: "string", example: "name" },
                  stock_quantity: { type: "integer", example: 8 },
                  price: { type: "number", example: 1023.45 },
                  currency: { type: "string", example: "USD" },
                  image: { type: "string", example: "http://www.images.com/yourimage" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product added successfully" },
                    product: {
                      type: "object",
                      properties: {
                        category: { type: "string", example: "categ" },
                        name: { type: "string", example: "name" },
                        stock_quantity: { type: "integer", example: 8 },
                        price: { type: "number", example: 1023.45 },
                        currency: { type: "string", example: "USD" },
                        image: { type: "string", example: "http://www.images.com/yourimage" },
                        _id: { type: "string", example: "681fd1dae07055db24b902a9" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      get: {
        summary: "Get a list of products",
        tags: ["Products"],
        parameters: [
          {
            name: "name",
            in: "query",
            description: "Filter products by name",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "price",
            in: "query",
            description: "Filter products by price",
            required: false,
            schema: { type: "number" },
          },
          {
            name: "category",
            in: "query",
            description: "Filter products by category",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "stock_quantity",
            in: "query",
            description: "Filter products by stock quantity",
            required: false,
            schema: { type: "integer" },
          },
          {
            name: "currency",
            in: "query",
            description: "Filter products by currency",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "image",
            in: "query",
            description: "Filter products by image URL or identifier",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "A list of products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    numberOfProducts: { type: "integer", example: 1 },
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string", example: "681e010c2833643d5e98dccb" },
                          category: { type: "string", example: "categ" },
                          name: { type: "string", example: "name" },
                          price: { type: "number", example: 100 },
                          stock_quantity: { type: "integer", example: 4 },
                          currency: { type: "string", example: "USD" },
                          isDeleted: { type: "boolean", example: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "getaddrinfo ENOTFOUND"
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/products/{idProduct}": {
      put: {
        summary: "Update a product",
        tags: ["Products"],
        parameters: [
          {
            name: "idProduct",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the product",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  category: { type: "string", example: "categ" },
                  name: { type: "string", example: "name" },
                  stock_quantity: { type: "integer", example: 8 },
                  price: { type: "number", example: 1023.45 },
                  currency: { type: "string", example: "USD" },
                  image: { type: "string", example: "http://www.images.com/yourimage" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product updated successfully" },
                    product: {
                      type: "object",
                      properties: {
                        category: { type: "string", example: "categ" },
                        name: { type: "string", example: "name" },
                        stock_quantity: { type: "integer", example: 8 },
                        price: { type: "number", example: 1023.45 },
                        currency: { type: "string", example: "USD" },
                        image: { type: "string", example: "http://www.images.com/yourimage" },
                        _id: { type: "string", example: "681fd1dae07055db24b902a9" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        summary: "Delete a product",
        tags: ["Products"],
        parameters: [
          {
            name: "idProduct",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the product",
          },
        ],
        responses: {
          200: {
            description: "Product deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product deleted successfully" },
                    product: {
                      type: "object",
                      properties: {
                        category: { type: "string", example: "categ" },
                        name: { type: "string", example: "name" },
                        stock_quantity: { type: "integer", example: 8 },
                        price: { type: "number", example: 1023.45 },
                        currency: { type: "string", example: "USD" },
                        image: { type: "string", example: "http://www.images.com/yourimage" },
                        _id: { type: "string", example: "681fd1dae07055db24b902a9" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      }
    }
  },
};

module.exports = productPaths;
