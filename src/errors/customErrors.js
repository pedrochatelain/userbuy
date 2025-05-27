class CustomError extends Error {
    constructor(error, statusCode, details) {
        super(error, statusCode)
        this.statusCode = statusCode;
        this.error = error
        this.details = details
    }
}

class UserNotFound extends CustomError {
    constructor(error = "User not found") {
        super(error, 404);
    }
}

class ProductsNotFound extends CustomError {
    constructor(products) {
        super(`These products ID were not found: ${products}`, 404);
    }
}

class InsufficientFunds extends CustomError {
    constructor() {
        super("Insufficient funds", 402);
    }
}

class InvalidCredentials extends CustomError {
    constructor() {
        super("Invalid credentials. Try again", 400);
    }
}

class DeletedUser extends CustomError {
    constructor() {
        super("User was deleted", 403);
    }
}

class ProductRejectedByAI extends CustomError {
    constructor(issues) {
        super("Product rejected by AI", 400); // Call the parent constructor with the message
        this.issues = issues
    }  
}

module.exports = { UserNotFound, ProductsNotFound, InsufficientFunds, InvalidCredentials, DeletedUser, ProductRejectedByAI }