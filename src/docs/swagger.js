const swaggerJsDoc = require("swagger-jsdoc");
const usersPaths = require("./user.docs");
const loginPath = require("./login.docs");

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
    },
    components: {
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
