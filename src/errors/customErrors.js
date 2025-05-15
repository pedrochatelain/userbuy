class CustomError extends Error {
    constructor(error, statusCode) {
        super(error);
        this.statusCode = statusCode;
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

module.exports = { UserNotFound, ProductsNotFound, InsufficientFunds, InvalidCredentials, DeletedUser }