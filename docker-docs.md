# Docker Documentation - Twitter Clone Backend

This documentation outlines how to use Docker to set up and run the Twitter Clone Backend application.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop for Mac/Windows)
- Git for cloning the repository (optional)

## Project Structure

The Twitter Clone Backend uses a containerized architecture with two main services:

1. **Node.js Application**: Express.js backend API
2. **MongoDB Database**: NoSQL database for storing user and tweet data

## Configuration Files

### Dockerfile

```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 2000

# Start the application
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "2000:2000"
    environment:
      - PORT=2000
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/twitter-clone
      - JWT_SECRET=your_jwt_secret_key_here
      - REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
    depends_on:
      - mongo
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/twitter-clone-backend.git
cd twitter-clone-backend
```

### Build and Start the Application

```bash
docker compose up --build
```

This command will:
1. Build the Node.js application image
2. Start both the application and MongoDB containers
3. Connect the two services
4. Map the required ports to your host machine

The application will be available at `http://localhost:2000`.

### Running in Background

To run the containers in the background (detached mode):

```bash
docker compose up -d
```

### Stopping the Application

To stop the running containers:

```bash
docker compose down
```

## Environment Variables

The application container uses several environment variables that you can customize:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port the application listens on | 2000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://mongo:27017/twitter-clone |
| JWT_SECRET | Secret key for JWT authentication | your_jwt_secret_key_here |
| REFRESH_TOKEN_SECRET | Secret key for refresh tokens | your_refresh_token_secret_here |

You can modify these values in the `docker-compose.yml` file or create a `.env` file.

## Data Persistence

MongoDB data is persisted through a Docker volume named `mongodb_data`. This ensures your data is preserved even when containers are stopped or removed.

## Useful Commands

### View Running Containers

```bash
docker ps
```

### View Container Logs

```bash
# View app logs
docker logs twitter-clone-backend-app-1

# View MongoDB logs
docker logs twitter-clone-backend-mongo-1

# Follow logs in real-time
docker logs -f twitter-clone-backend-app-1
```

### Execute Commands in Containers

```bash
# Access Node.js container shell
docker exec -it twitter-clone-backend-app-1 sh

# Access MongoDB shell
docker exec -it twitter-clone-backend-mongo-1 mongosh
```

### Rebuild Containers

If you make changes to the application code, the changes will be reflected automatically due to volume mapping. However, if you change the Dockerfile or add dependencies, you'll need to rebuild:

```bash
docker compose up --build
```

## Development Workflow

The setup includes volume mapping for the application code, allowing you to make changes to your code without rebuilding the container. The Node.js container maps:

- `.:/usr/src/app`: Your local project directory is mapped to the app directory in the container
- `/usr/src/app/node_modules`: The node_modules directory is preserved in the container

This enables a smooth development workflow where you can:

1. Edit code on your local machine
2. See changes reflected immediately in the running container
3. View logs in real-time to debug issues

## Troubleshooting

### Connection Issues

If the application can't connect to MongoDB, check:

1. The MongoDB container is running (`docker ps`)
2. The connection string in `docker-compose.yml` is correct
3. MongoDB logs for any errors (`docker logs twitter-clone-backend-mongo-1`)

### Port Conflicts

If you see errors about ports already in use:

1. Check if another process is using port 2000 or 27017
2. Stop those processes or change the ports in `docker-compose.yml`

### Container Not Starting

If containers fail to start:

1. Check logs for error messages (`docker logs twitter-clone-backend-app-1`)
2. Ensure all required files are present in your project directory
3. Verify Docker and Docker Compose are installed correctly

## Production Deployment Considerations

For production environments, consider:

1. Setting `NODE_ENV=production` in `docker-compose.yml`
2. Using more secure JWT secrets
3. Enabling MongoDB authentication
4. Implementing proper logging and monitoring
5. Setting up a reverse proxy (like Nginx) in front of the application
6. Using Docker Swarm or Kubernetes for container orchestration

## Security Notes

1. Never commit sensitive information (JWT secrets, database credentials) to version control
2. Consider using environment variables or secrets management for sensitive data
3. In production, remove debugging tools and restrict access to containers

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
