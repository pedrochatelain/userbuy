const usersPaths = {
    "/api/users": {
      post: {
        summary: "Create a new user",
        tags: ["Users"],
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
          201: { 
            description: "User created successfully",
            content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User created successfully" },
                      user: {
                        type: "object",
                        properties: {
                          username: { type: "string", example: "John Doe" },
                          password: {
                            type: "string",
                            example: "$2b$10$G9I8Fwqlt99JAVrw1tN9TeT4ygvMaHKAlIk3Qt9bYpCs7JyJHmep6",
                          },
                          _id: { type: "string", example: "681a9edeeb5dbad6fd8fdaae" },
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
                      error: { type: "string", example: "Invalid fields: foo, bar" },
                    },
                  },
                },
            },
        },
        },
      },
      get: {
        summary: "Get a list of users",
        tags: ["Users"],
        responses: {
          200: {
            description: "List of users",
            content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "681a9edeeb5dbad6fd8fdaae" },
                        username: { type: "string", example: "John Doe" },
                        password: {
                          type: "string",
                          example: "$2b$10$G9I8Fwqlt99JAVrw1tN9TeT4ygvMaHKAlIk3Qt9bYpCs7JyJHmep6",
                        },
                      },
                    },
                    example: [
                      {
                        _id: "681a9edeeb5dbad6fd8fdaae",
                        username: "John Doe",
                        password: "$2b$10$G9I8Fwqlt99JAVrw1tN9TeT4ygvMaHKAlIk3Qt9bYpCs7JyJHmep6",
                      },
                      {
                        _id: "681a9edeeb5dbad6fd8fdabf",
                        username: "Jane Smith",
                        password: "$2b$10$kljKSD8fsdfD2YyqkQ3kd9Fwqlt99JAVrw1tN9TeT4ygvMaHKAlIk3",
                      },
                    ],
                  },
                },
              },
          },
          500: { 
            description: "Error fetching users", 
            content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Error fetching users" },
                    },
                  },
                },
            },
        },
        },
      },
    },
    "/api/users/{userId}/roles": {
      patch: {
        summary: "Edit user roles",
        tags: ["Users"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the user",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  roles: {
                    type: "array",
                    items: { type: "string" },
                    example: ["ADMIN", "CUSTOMER"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Roles updated successfully" },
          400: { description: "Validation errors" },
        },
      },
    },
  };
  
  module.exports = usersPaths;
  