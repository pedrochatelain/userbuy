const productPaths = {
  openapi: "3.0.0",
  info: {
    title: "Products API",
    version: "1.0.0",
  },
  components: {
    responses: {
      BadRequest: {
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
              unexpectedFields: {
                summary: "Unexpected fields",
                value: { error: "Unexpected fields: foo, bar" },
              },
              errors: {
                summary: "Bad request",
                value: {
                  errors: [
                    {
                      type: "field",
                      msg: "foo is required",
                      path: "foo",
                      location: "body",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
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
  },
};

module.exports = productPaths;
