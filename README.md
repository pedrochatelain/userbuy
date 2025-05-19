# UserBuy

**UserBuy** is a simple e-commerce application designed to showcase core backend development skills using Node.js. This project focuses on user management, role-based access, and managing virtual payment methods.

The app is hosted on Render, allowing you to interact with the application without local setup.

## Features

- **User Management:**
  - Users can be assigned roles such as `ADMIN` or `CUSTOMER`.
  - Each user profile includes information on available funds in different payment methods.

- **Roles and Access Control:**
  - `ADMIN`: Has privileges to manage products, view user information, and oversee the system.
  - `CUSTOMER`: Can browse, search, and buy products.

- **Product Validation:**
  - In production, the app communicates with the Gemini API, which uses AI to validate product data before adding or updating products.

## Technologies Used

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB for storing users, products, and purchases
- **Authentication:** JWT for secure login sessions
- **Testing:** Jest for unit testing
- **Version Control:** Git and GitHub for project collaboration
- **Containerization:** Docker for easy deployment and consistent environments

## Getting Started

The recommended way to run UserBuy is by using Docker Desktop, which simplifies environment setup and ensures consistent behavior.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/pedrochatelain/userbuy.git
   cd userbuy
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```env
   JWT_SECRET=your_secret_key
   PORT=3000
   DATABASE_NAME=userbuy
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

   > **Note:** If you are on Linux, remember to use `sudo` to run Docker commands.

## Documentation

You can explore and interact with the API using the integrated Swagger documentation.

- **Local Deployment**: Once the application is running locally, navigate to http://localhost:3000/docs.

- **Render Deployment**: The Swagger documentation for the hosted application is available at https://userbuy.onrender.com/docs/.
This provides a user-friendly interface to test endpoints and understand the API structure for both the local and deployed versions.