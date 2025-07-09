const productPaths = {
  paths: {
    "/api/products": {
      post: {
        summary: "Create a new product",
        tags: ["Products"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  category: { type: "string", example: "categ" },
                  name: { type: "string", example: "name" },
                  stock_quantity: { type: "integer", example: 8 },
                  price: { type: "number", example: 1023.45 },
                  currency: { type: "string", example: "USD" },
                  image: { type: "string", format: "binary", example: "myimage.jpg" },
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
      get: {
        summary: "Get product by id",
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
            description: "Product fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product fetched successfully" },
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
      },
    },
    "/api/products/{idProduct}/image": {
      patch: {
        summary: "Update image of a product",
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
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  "image": { "type": "string", "format": "binary" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Image successfully added",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Image added successfully" },
                    product: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "681e010c2833643d5e98dccb" },
                        category: { type: "string", example: "foo" },
                        name: { type: "string", example: "bar" },
                        price: { type: "number", example: 100 },
                        stock_quantity: { type: "integer", example: 4 },
                        currency: { type: "string", example: "USD" },
                        image: { type: "string", example: "http://yourimage.com/yourimage" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error: Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
                examples: {
                  mismatchProductNameAndImage: {
                    summary: "Mismatch product name and image",
                    value: { 
                      statusCode: 400,
                      error: "Product name does not match image",
                      details: {
                        productName: "foo",
                        geminiResponse: "bar",
                        match: false
                      },
                    },
                  },
                },
              },
            }
          },
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
          404: { $ref: "#/components/responses/ProductNotFound" },
        },
      },
    }
  },
};

module.exports = productPaths;
