const loginPath = {
    "/api/login": {
      post: {
        summary: "Login",
        tags: ["Login"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "John Doe" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { 
            description: "User logged in successfully",
            content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User logged in successfully" },
                      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJkYTFkZTViNDQwZTNjYmZhMGQ4ZiIsInVzZXJuYW1lIjoicnIiLCJpYXQiOjE3NDY4OTA1ODMsImV4cCI6MTc0Njg5NDE4M30.zuVwg9s805BiTKbFALDuyjjH3rossudLqE74bsWtwBf"},
                      user: {
                        type: "object",
                        properties: {
                          _id: { type: "string", example: "681bd97be93006d979837e1b" },
                          username: { type: "string", example: "x" },
                          password: { 
                            type: "string", 
                            example: "$2b$10$orAJHiBrrwJoRMA0LSRhJOwiNRGqTwk.a9OWz46vRLkKUK39f7HQu" 
                          },
                          balances: { type: "number", example: -100 },
                          role: { type: "string", example: "CUSTOMER" }
                        },
                      }
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
                      error: { type: "string", example: "Invalid credentials. Try again" },
                    },
                  },
                },
            },
          },
          404: {
            description: "Error: Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "User not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/logout": {
      post: {
        summary: "Logout",
        description: "Add user JWT Token to blacklist",
        tags: ["Login"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string", example: "your_jwt_token" },
                },
              },
            },
          },
        },
        responses: {
          200: { 
            description: "User logged out successfully",
            content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User logged out successfully" },
                      blacklistedToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJkYTFkZTViNDQwZTNjYmZhMGQ4ZiIsInVzZXJuYW1lIjoicnIiLCJpYXQiOjE3NDY4OTA1ODMsImV4cCI6MTc0Njg5NDE4M30.zuVwg9s805BiTKbFALDuyjjH3rossudLqE74bsWtwBf"},
                    },
                  },
                },
            },
          },
          409: { 
            description: "Token already blacklisted", 
            content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      statusCode: { type: "number", example: 409 },
                      error: { type: "string", example: "Token already blacklisted" },
                    },
                  },
                },
            },
          },
          500: {
            description: "JWT malformed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "JsonWebTokenError",
                    },
                    message: {
                      type: "string",
                      example: "invalid signature",
                    },
                    statusCode: {
                      type: "number",
                      example: 500,
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
  
  module.exports = loginPath;
  