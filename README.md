# Tour Management Backend

This is the backend service for a Tour Management application. It provides APIs for user authentication, user management, and other tour-related functionalities.

## Features

*   User registration and login
*   JWT-based authentication (access and refresh tokens)
*   Password hashing using bcrypt
*   Role-based access control (implicit with super admin)
*   Environment variable management with dotenv
*   Input validation with Zod
*   MongoDB database with Mongoose ODM

## Technologies Used

*   **Node.js:** JavaScript runtime environment
*   **Express.js:** Web framework for Node.js
*   **TypeScript:** Superset of JavaScript that adds static typing
*   **MongoDB:** NoSQL database
*   **Mongoose:** MongoDB object modeling for Node.js
*   **JWT (JSON Web Tokens):** For securing APIs
*   **Passport.js:** Authentication middleware for Node.js (with strategies for local and Google OAuth)
*   **Zod:** TypeScript-first schema validation
*   **ESLint:** For code linting

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tour-management-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the variables from the `.env.example` file.

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your specific configurations.

## Running the Application

To run the application in development mode with auto-reloading, use:

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default is 4001).

## API Endpoints

The API is designed to be RESTful. All endpoints are prefixed with `/api`.

### Authentication

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in a user and receive JWT tokens.
*   `POST /api/auth/refresh-token`: Obtain a new access token using a refresh token.

### Users

*   `GET /api/users`: Get a list of all users.
*   `GET /api/users/:id`: Get a single user by their ID.
*   `PUT /api/users/:id`: Update a user's information.
*   `DELETE /api/users/:id`: Delete a user.

---

## API Guideline

### General

*   The base URL for the API is `/api`.
*   All responses are in JSON format.
*   Successful requests will return a `2xx` status code.
*   Client errors will return a `4xx` status code with a descriptive error message.
*   Server errors will return a `5xx` status code.

### Authentication Endpoints

#### `POST /api/auth/register`

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "user" 
}
```

**Validation Rules:**

*   `name`: Required, string.
*   `email`: Required, must be a valid email format.
*   `password`: Required, string, at least 8 characters.
*   `role`: Optional, string, defaults to `user`.

**Success Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "_id": "60d5f1b3e6b3f1b3e6b3f1b3",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### `POST /api/auth/login`

Log in a user.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**

Sets `accessToken` and `refreshToken` as cookies and returns user data.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "_id": "60d5f1b3e6b3f1b3e6b3f1b3",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### `POST /api/auth/refresh-token`

Obtain a new access token. The `refreshToken` must be sent as a cookie.

**Success Response (200 OK):**

Sets a new `accessToken` as a cookie.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token refreshed successfully"
}
```

### User Endpoints

Authentication is required for these endpoints. The `accessToken` must be sent as a cookie.

#### `GET /api/users`

Get a list of all users.

**Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "60d5f1b3e6b3f1b3e6b3f1b3",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    {
      "_id": "60d5f1b3e6b3f1b3e6b3f1b4",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "admin"
    }
  ]
}
```

#### `GET /api/users/:id`

Get a single user by their ID.

**Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "_id": "60d5f1b3e6b3f1b3e6b3f1b3",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### `PUT /api/users/:id`

Update a user's information.

**Request Body:**

```json
{
  "name": "Johnathan Doe"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "_id": "60d5f1b3e6b3f1b3e6b3f1b3",
    "name": "Johnathan Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

#### `DELETE /api/users/:id`

Delete a user.

**Success Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": null
}
```


## Environment Variables

The following environment variables are required for the application to run:

| Variable                  | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `PORT`                    | The port the server will run on.                  |
| `DB_URL`                  | Your MongoDB connection string.                   |
| `NODE_ENV`                | The application environment (e.g., `development`). |
| `JWT_SECRET`              | Secret key for signing JWT access tokens.         |
| `JWT_EXPIRED_IN`          | Expiration time for JWT access tokens.            |
| `JWT_REFRESH_SECRET`      | Secret key for signing JWT refresh tokens.        |
| `JWT_REFRESH_EXPIRED_IN`  | Expiration time for JWT refresh tokens.           |
| `BCRYPT_SALT_ROUNDS`      | Number of salt rounds for bcrypt hashing.         |
| `SUPER_ADMIN_EMAIL`       | Email for the default super admin user.           |
| `SUPER_ADMIN_PASSWORD`    | Password for the default super admin user.        |

## Project Structure

```
tour-management-backend/
├── src/
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # Server entry point
│   └── app/
│       ├── config/           # Configuration files (e.g., passport, env)
│       ├── errorHelpers/     # Custom error handling
│       ├── interface/        # TypeScript interfaces
│       ├── middlewares/      # Express middlewares
│       ├── modules/          # Feature modules (e.g., auth, user)
│       ├── routes/           # Main API router
│       └── utils/            # Utility functions
├── .env.example              # Example environment variables
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript compiler options
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the ISC License.
