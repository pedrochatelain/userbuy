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

class ProductNotFound extends CustomError {
    constructor(idProduct) {
        super(`The product with id "${idProduct}" was not found`, 404);
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

class TokenAlreadyBlacklisted extends CustomError {
    constructor() {
        super("Token already blacklisted", 409);
    }
}

class ProductRejectedByAI extends CustomError {
    constructor(issues) {
        super("Product rejected by AI", 400); // Call the parent constructor with the message
        this.issues = issues
    }  
}

class MismatchProductNameAndImage extends CustomError {
    constructor(details) {
        super("Product name does not match image", 400, details); // Call the parent constructor with the message
    }  
}

module.exports = { 
    UserNotFound, 
    ProductsNotFound, 
    InsufficientFunds, 
    InvalidCredentials, 
    DeletedUser, 
    ProductRejectedByAI, 
    ProductNotFound,
    MismatchProductNameAndImage,
    TokenAlreadyBlacklisted
}