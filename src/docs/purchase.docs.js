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
         404: { $ref: "#/components/responses/NotFound" },

          // 400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      // get: {
      //   // Existing definitions for "get"
      // },
    },
  },
};

module.exports = purchasePaths;
