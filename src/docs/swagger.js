const swaggerJsDoc = require("swagger-jsdoc");
const usersPaths = require("./user.docs");
const loginPath = require("./login.docs");
const productPaths = require("./product.docs");
const purchasePaths = require("./purchase.docs");

// Use the environment variable if available, otherwise default to localhost
const serverUrl = process.env.SERVER_URL || "http://localhost:3000";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Userbuy",
      version: "1.0.0",
      description: "A simple e-commerce backend app",
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
    paths: {
      ...loginPath,
      ...usersPaths,
      ...productPaths.paths,
      ...purchasePaths.paths
    },
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
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/features/user/user.routes.js"], // Path to your route files for annotations
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
