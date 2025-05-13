const purchasePaths = {
  components: {
    responses: {
      Unauthorized: {
        description: "Error: Unauthorized",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
            examples: {
              missingToken: {
                summary: "Missing Token",
                value: { message: "Access token is missing" },
              },
              invalidToken: {
                summary: "Invalid or Expired Token",
                value: { message: "Invalid or expired token" },
              },
            },
          },
        },
      },
      Forbidden: {
        description: "Error: Forbidden",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Forbidden: You do not have permission to perform this action",
                },
              },
            },
          },
        },
      },
      NotFound: {
        description: "Error: Not Found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
            examples: {
              userNotFound: {
                summary: "User Not Found",
                value: { error: "User not found" },
              },
              productNotFound: {
               summary: "Product Not Found",
               value: { error: "These products ID were not found: 681e010c2833643d5e98dccb" },
              },
            },
          },
        },
      },
      PurchaseNotFound: {
        description: "Purchase Not Found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Purchase not found",
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/purchases": {
      post: {
        summary: "Create a new purchase",
        tags: ["Purchases"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  idUser: { type: "string", example: "681bda1de5b440e3cbfa0d8f" },
                  idProduct: { type: "string", example: "681e010c2833643d5e98dccb" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Purchase added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "added purchase" },
                    purchase: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "68224742c63e8f5e97ffb283" },
                        userID: { type: "string", example: "681bda1de5b440e3cbfa0d8f" },
                        product: {
                          type: "object",
                          properties: {
                            _id: { type: "string", example: "681f7ae3369301c971123740" },
                            category: { type: "string", example: "any" },
                            name: { type: "string", example: "we" },
                            price: { type: "number", example: 100 },
                            stock_quantity: { type: "integer", example: 4 },
                            currency: { type: "string", example: "USD" },
                            chaa: { type: "string", example: "jaja" },
                          },
                        },
                        purchaseDate: {
                          type: "string",
                          format: "date-time",
                          example: "2025-05-12T19:08:50.138Z",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          402: {
            description: "Error: Payment Required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Insufficient funds" },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      get: {
        summary: "Get a list of purchases",
        tags: ["Purchases"],
        responses: {
          200: {
            description: "List of purchases",
            content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    example: [
                      {
                        "_id": "681bda52d5613c069cc7143f",
                        "userID": "681bda4ad5613c069cc7143e",
                        "product": {
                            "_id": "681bd8d8f8dcfaa3599e4950",
                            "category": "any",
                            "name": "we",
                            "price": 100,
                            "stock_quantity": 4,
                            "currency": "USD"
                        },
                        "purchaseDate": "2025-05-07T22:10:26.448Z"
                      },
                    ],
                  },
                },
            },
          },
          500: { 
            description: "Error fetching purchases", 
            content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Error fetching purchases" },
                    },
                  },
                },
            },
        },
        },
      },
    },
    "/api/users/{idUser}/purchases": {
      get: {
        summary: "Get user's purchases",
        tags: ["Purchases"],
        parameters: [
          {
            name: "idUser",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of user",
          },
        ],
        responses: {
          200: {
            description: "Product deleted successfully",
            content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    example: [
                      {
                        "_id": "681bda52d5613c069cc7143f",
                        "userID": "681bda4ad5613c069cc7143e",
                        "product": {
                            "_id": "681bd8d8f8dcfaa3599e4950",
                            "category": "foo",
                            "name": "bar",
                            "price": 100,
                            "stock_quantity": 4,
                            "currency": "USD"
                        },
                        "purchaseDate": "2025-05-07T22:10:26.448Z"
                      },
                    ],
                  },
                },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },

        }
      }
    },
    "/api/purchases/{idPurchase}": {
      delete: {
        summary: "Delete purchase",
        tags: ["Purchases"],
        parameters: [
          {
            name: "idPurchase",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the purchase",
          },
        ],
        responses: {
          200: { 
            description: "Purchase deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    deletedPurchase: {
                      example: {
                        "_id": "681bda52d5613c069cc7143f",
                        "userID": "681bda4ad5613c069cc7143e",
                        "product": {
                            "_id": "681bd8d8f8dcfaa3599e4950",
                            "category": "any",
                            "name": "we",
                            "price": 100,
                            "stock_quantity": 4,
                            "currency": "USD"
                        },
                        "purchaseDate": "2025-05-07T22:10:26.448Z"
                      },
                    }
                  },
                },
              },
            }
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/PurchaseNotFound" },
        }
      }
    }
  },
};

module.exports = purchasePaths;
