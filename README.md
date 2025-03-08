# Twitter Clone Backend

A robust RESTful API backend for a Twitter clone built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**

  - Register, login, JWT-based authentication
  - Password hashing with bcryptjs
  - Token refresh mechanism

- **User Management**

  - Profile viewing and updating
  - Follow/unfollow functionality
  - User search

- **Tweet Management**

  - Create, read, update, delete tweets
  - Like and unlike tweets
  - Retweet/quote tweet functionality
  - Comment on tweets
  - Media attachment support

- **Timeline**

  - Home timeline (tweets from followed users)
  - User timeline
  - Comment threads

- **Search Functionality**
  - Search tweets by content
  - Search users by username or bio

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Docker** - Containerization
- **Swagger** - API documentation

## Prerequisites

To run this project, you need to have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local instance or cloud-based like MongoDB Atlas)
- Docker and Docker Compose (optional, for containerized setup)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/zainsubhani/EPITA_TwitterClone
cd twitter-clone-backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=2000
MONGODB_URI=mongodb://localhost:27017/twitter-clone
JWT_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

### Running the Server

#### Local Development

```bash
# Start the server
npm start

# Start with nodemon for development (auto-reload)
npm run dev
```

#### Using Docker

```bash
# Build and start containers
docker compose up --build

# Run in background
docker compose up -d

# Stop containers
docker compose down
```

### API Documentation

The API documentation is available via Swagger UI at:

- Local: http://localhost:2000/api-docs
- Docker: http://localhost:2000/api-docs

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login user
- **GET /api/auth/me** - Get current user
- **POST /api/auth/refresh-token** - Refresh access token

### Users

- **GET /api/users/:username** - Get user profile
- **PUT /api/users/:id** - Update user profile
- **POST /api/users/:id/follow** - Follow a user
- **POST /api/users/:id/unfollow** - Unfollow a user
- **GET /api/users/suggestions/users** - Get suggested users
- **GET /api/users/search/users?q=query** - Search users

### Tweets

- **POST /api/tweets** - Create a tweet
- **GET /api/tweets/:id** - Get tweet by ID
- **DELETE /api/tweets/:id** - Delete a tweet
- **GET /api/tweets/timeline/home** - Get home timeline
- **GET /api/tweets/user/:username** - Get user tweets
- **GET /api/tweets/user/:username/replies** - Get user replies
- **GET /api/tweets/:id/replies** - Get tweet replies
- **POST /api/tweets/:id/like** - Like/unlike tweet
- **POST /api/tweets/:id/retweet** - Retweet/unretweet
- **POST /api/tweets/:id/comment** - Add comment to tweet
- **GET /api/tweets/search/tweets?q=query** - Search tweets

## Testing the API

You can test the API using Postman or any other API client.

### Using Postman

1. Import the Postman collection from the `docs` folder (if available)
2. Create an environment with variables:
   - `baseUrl`: http://localhost:2000/api
   - `token`: (this will be filled automatically after login)

### Using Swagger UI

1. Access the Swagger documentation at http://localhost:2000/api-docs
2. Use the Swagger UI interface to test endpoints
3. For authenticated endpoints:
   - First execute the login endpoint to get a token
   - Click the "Authorize" button and enter your token
   - Use the format: `Bearer your_token_here`

### Sample Testing Flow

1. Register a new user: `POST /api/auth/register`

   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "confirmPassword": "password123",
     "name": "Test User"
   }
   ```

2. Login: `POST /api/auth/login`

   ```json
   {
     "username": "testuser",
     "password": "password123"
   }
   ```

3. Create a tweet: `POST /api/tweets`

   ```json
   {
     "content": "Hello world! #FirstTweet"
   }
   ```

4. Get home timeline: `GET /api/tweets/timeline/home`

## Project Structure

```
twitter-clone-backend/
│
├── api/
│   ├── Config/
│   │   └── db.js                # Database connection
│   │
│   ├── Controller/
│   │   ├── authController.js    # Authentication controllers
│   │   ├── userController.js    # User related controllers
│   │   └── tweetController.js   # Tweet related controllers
│   │
│   ├── MiddleWare/
│   │   ├── auth.js              # Authentication middleware
│   │   └── error.js             # Error handling middleware
│   │
│   ├── Models/
│   │   ├── User.js              # User model
│   │   └── Tweet.js             # Tweet model
│   │
│   ├── Routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── user.js              # User routes
│   │   └── tweet.js             # Tweet routes
│   │
│   └── Utils/
│       ├── validator.js         # Input validation
│       └── helpers.js           # Helper functions
│
├── docker-compose.yml           # Docker compose configuration
├── Dockerfile                   # Docker configuration
├── .env                         # Environment variables
├── package.json                 # Project dependencies
├── server.js                    # Entry point for the application
├── SwaggerApi.json              # API documentation
└── README.md                    # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)
