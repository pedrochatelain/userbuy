# UserBuy

**UserBuy** is a simple e-commerce application designed to showcase core backend development skills using Node.js. This project focuses on user management, role-based access, and managing virtual payment methods.

## Features

- **User Management:**
  - Users can be assigned roles such as `ADMIN` or `CUSTOMER`.
  - Each user profile includes information on available funds in different payment methods.

- **Roles and Access Control:**
  - `ADMIN`: Has privileges to manage products, view user information, and oversee the system.
  - `CUSTOMER`: Can browse, search and buy products

## Technologies Used

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB for storing users, products and purchases
- **Authentication:** JWT for secure login sessions
- **Testing:** Jest for unit testing
- **Version Control:** Git and GitHub for project collaboration
- **Containerization:** Docker for easy deployment and consistent environments

## Getting Started

You can run UserBuy either using Docker or by installing the prerequisites directly on your system.

### Option 1: Running with Docker

#### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

#### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/pedrochatelain/userbuy.git
   cd userbuy
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```env
   MONGO_URI=mongodb://mongo:27017/userbuy
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

   Note: The MongoDB host is set to `mongo` to match the service name in Docker Compose.

3. Build and run the containers:

   ```bash
   docker compose up
   ```

   This command will:
   - Build the Node.js application image
   - Start the MongoDB container
   - Link both services together
   - Make the application accessible on port 3000

4. Access the application at `http://localhost:3000`.

5. To stop the application:

   ```bash
   docker compose down
   ```

- Note: If you are in Linux remember to use `sudo` to run Docker commands

### Option 2: Local Installation

#### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js)

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pedrochatelain/userbuy.git
   cd userbuy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/userbuy
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

4. Run the application:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

### Running Tests

To execute unit tests:

#### With Docker:

```bash
docker exec -it userbuy_app npm test
```

#### Without Docker:

```bash
npm test
```

## API Endpoints

### User Endpoints

- **GET /api/users**: Retrieve a list of users (requires `ADMIN` role).
- **POST /api/users**: Create a new user.

### Authentication Endpoints

- **POST /api/login**: Log in as a user.

### Product Endpoints

- **GET /api/products**: Retrieve a list of products.
- **POST /api/products**: Add a new product (requires `ADMIN` role).
- **DELETE /api/products/:id**: Delete a product (requires `ADMIN` role).

### Purchase Endpoints

- **GET /api/purchases**: Retrieve a list of purchases (requires `ADMIN` role).
- **POST /api/purchases**: Add a new purchase
- **GET /api/purchases/:userId**: Retrieve a list of purchases made by a user (requires LOGIN first).