const productPaths = {
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
                  price: { type: "number", example: "1023.45" },
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
                          price: { type: "number", example: "1023.45" },
                          currency: { type: "string", example: "USD" },
                          image: { type: "string", example: "http://www.images.com/yourimage" },
                          _id: { type: "string", example: "681fd1dae07055db24b902a9" }
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
                  error: { type: "string" }
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
                          "type": "field",
                          "msg": "foo is required",
                          "path": "foo",
                          "location": "body"
                      }
                    ]
                  },
                },
              },
            },
          },
        },
      },
    },
  }
};
  
module.exports = productPaths;
  