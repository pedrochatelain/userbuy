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
    "/api/users/{idUser}": {
      delete: {
        summary: "Delete user",
        tags: ["Users"],
        parameters: [
          {
            name: "idUser",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the user",
          },
        ],
        responses: {
          200: { 
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User deleted successfully",
                    },
                    deletedUser: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "681bd97be93006d979837e1b" },
                        username: { type: "string", example: "x" },
                        password: { 
                          type: "string", 
                          example: "$2b$10$orAJHiBrrwJoRMA0LSRhJOwiNRGqTwk.a9OWz46vRLkKUK39f7HQu" 
                        },
                        balances: { type: "number", example: -100 },
                        role: { type: "string", example: "CUSTOMER" },
                        isDeleted: { type: "boolean", example: true}
                      },
                    },
                  },
                },
              },
            }
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
                  invalidIdForUser: {
                    summary: "Invalid ID for user",
                    value: { error: "Invalid ID for userId" },
                  },
                  extraFields: {
                    summary: "Extra fields included",
                    value: {
                      success: false,
                      errors: [
                        "The request can only include the `role` field."
                      ]
                    },
                  },
                  invalidRole: {
                    summary: "Invalid role",
                    value: {
                      success: false,
                      errors: [
                        "role must be one of the following: ADMIN, CUSTOMER"
                      ]
                    }
                  }
                },
              },
            },
          },
          401: {
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
          403: {
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
          }
        }
      }
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
                  role: {
                    type: "string",
                    example: "admin",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { 
            description: "Roles updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Role updated successfully",
                    },
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
                        role: { type: "string", example: "CUSTOMER" },
                      },
                    },
                  },
                },
              },
            }
                     
          },
          401: {
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
                  invalidIdForUser: {
                    summary: "Invalid ID for user",
                    value: { error: "Invalid ID for userId" },
                  },
                  extraFields: {
                    summary: "Extra fields included",
                    value: {
                      success: false,
                      errors: [
                        "The request can only include the `role` field."
                      ]
                    },
                  },
                  invalidRole: {
                    summary: "Invalid role",
                    value: {
                      success: false,
                      errors: [
                        "role must be one of the following: ADMIN, CUSTOMER"
                      ]
                    }
                  }
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
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Forbidden: You do not have permission to perform this action",
                    },
                  },
                },
              },
            },
          }
        },
      }
    },
    "/api/users/{userId}/balances": {
      patch: {
        summary: "Edit user balances",
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
                  amount: {
                    type: "number",
                    example: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { 
            description: "Roles updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User balances updated successfully",
                    },
                    response: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "681bd97be93006d979837e1b" },
                        username: { type: "string", example: "x" },
                        password: { 
                          type: "string", 
                          example: "$2b$10$orAJHiBrrwJoRMA0LSRhJOwiNRGqTwk.a9OWz46vRLkKUK39f7HQu" 
                        },
                        balances: { type: "number", example: -100 },
                        role: { type: "string", example: "CUSTOMER" },
                      },
                    },
                  },
                },
              },
            }
          },
          401: {
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
                  invalidIdForUser: {
                    summary: "Invalid ID for user",
                    value: { error: "Invalid ID for userId" },
                  },
                  invalidRole: {
                    summary: "Invalid role",
                    value: {
                      success: false,
                      errors: [
                        "role must be one of the following: ADMIN, CUSTOMER"
                      ]
                    }
                  }
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
                    message: {
                      type: "string",
                      example: "User not found",
                    },
                  },
                },
              },
            },
          },
          403: {
            description: "Error: Forbidden",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Forbidden: You do not have permission to access this resource",
                    },
                  },
                },
              },
            },
          }
        },
      }
    },
  };
  
  module.exports = usersPaths;
  