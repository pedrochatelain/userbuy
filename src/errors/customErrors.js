class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class UserNotFound extends CustomError {
    constructor(message = "User not found") {
        super(message, 404);
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

module.exports = { UserNotFound, ProductsNotFound, InsufficientFunds, InvalidCredentials, DeletedUser }