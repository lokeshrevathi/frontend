# Docker Deployment Guide

This guide explains how to build and deploy your React.js Project Management Dashboard using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Build and start the production container
docker-compose up --build

# The application will be available at http://localhost:3000
```

### 2. Build and Run with Docker Commands

```bash
# Build the Docker image
docker build -t project-management-frontend .

# Run the container
docker run -p 3000:80 project-management-frontend

# The application will be available at http://localhost:3000
```

## Development Mode

For development with hot-reloading:

```bash
# Start development container
docker-compose --profile dev up --build

# The development server will be available at http://localhost:3001
```

## Production Deployment

### 1. Build for Production

```bash
# Build the production image
docker build -t project-management-frontend:latest .

# Tag for your registry (replace with your registry)
docker tag project-management-frontend:latest your-registry/project-management-frontend:latest
```

### 2. Push to Registry

```bash
# Push to Docker Hub (replace with your username)
docker push your-username/project-management-frontend:latest

# Or push to other registries (AWS ECR, Google Container Registry, etc.)
```

### 3. Deploy to Cloud Platforms

#### AWS ECS/Fargate
```bash
# Create ECR repository
aws ecr create-repository --repository-name project-management-frontend

# Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
docker tag project-management-frontend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/project-management-frontend:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/project-management-frontend:latest
```

#### Google Cloud Run
```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/your-project-id/project-management-frontend
gcloud run deploy project-management-frontend --image gcr.io/your-project-id/project-management-frontend --platform managed --allow-unauthenticated
```

#### Azure Container Instances
```bash
# Build and push to Azure Container Registry
az acr build --registry your-registry-name --image project-management-frontend .
az container create --resource-group your-rg --name project-management-frontend --image your-registry-name.azurecr.io/project-management-frontend:latest --dns-name-label your-dns-name --ports 80
```

## Environment Variables

The application uses the following environment variables:

- `REACT_APP_API_URL`: Backend API URL (default: https://backend-z5zf.onrender.com)

### Setting Environment Variables

#### Docker Compose
```yaml
environment:
  - REACT_APP_API_URL=https://your-backend-url.com
```

#### Docker Run
```bash
docker run -p 3000:80 -e REACT_APP_API_URL=https://your-backend-url.com project-management-frontend
```

#### Kubernetes
```yaml
env:
- name: REACT_APP_API_URL
  value: "https://your-backend-url.com"
```

## Health Checks

The container includes a health check endpoint at `/health`:

```bash
# Test health check
curl http://localhost:3000/health
# Should return: healthy
```

## Monitoring and Logs

### View Container Logs
```bash
# Docker Compose
docker-compose logs -f frontend

# Docker
docker logs -f container-name
```

### Access Container Shell
```bash
# Docker Compose
docker-compose exec frontend sh

# Docker
docker exec -it container-name sh
```

## Performance Optimization

The Dockerfile includes several optimizations:

1. **Multi-stage build**: Reduces final image size
2. **Alpine Linux**: Lightweight base image
3. **Nginx**: High-performance web server
4. **Gzip compression**: Reduces bandwidth usage
5. **Static asset caching**: Improves load times

## Security Considerations

The nginx configuration includes security headers:

- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: XSS protection
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `Content-Security-Policy`: Content security policy

## Troubleshooting

### Build Issues

1. **Build fails with npm errors**:
   ```bash
   # Clear Docker cache
   docker system prune -a
   # Rebuild
   docker-compose build --no-cache
   ```

2. **Port already in use**:
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "8080:80"  # Use port 8080 instead of 3000
   ```

### Runtime Issues

1. **Application not accessible**:
   ```bash
   # Check if container is running
   docker ps
   # Check container logs
   docker logs container-name
   ```

2. **API connection issues**:
   - Verify `REACT_APP_API_URL` is correct
   - Check if backend is accessible from container
   - Ensure CORS is properly configured on backend

### Performance Issues

1. **Slow loading**:
   - Check if gzip compression is working
   - Verify static assets are being cached
   - Monitor network usage

2. **High memory usage**:
   - Check nginx worker processes
   - Monitor container resource usage

## Scaling

### Horizontal Scaling with Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml project-management
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-management-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: project-management-frontend
  template:
    metadata:
      labels:
        app: project-management-frontend
    spec:
      containers:
      - name: frontend
        image: project-management-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "https://backend-z5zf.onrender.com"
```

## Backup and Recovery

### Backup Configuration
```bash
# Export container configuration
docker inspect container-name > container-config.json

# Backup nginx configuration
docker cp container-name:/etc/nginx/nginx.conf ./nginx-backup.conf
```

### Restore
```bash
# Restore from backup
docker run -p 3000:80 -v $(pwd)/nginx-backup.conf:/etc/nginx/nginx.conf project-management-frontend
```

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Update Base Images
```bash
# Update Node.js base image
docker pull node:18-alpine

# Update nginx base image
docker pull nginx:alpine

# Rebuild
docker-compose build --no-cache
```

## Support

For issues related to:
- **Docker**: Check Docker documentation
- **Nginx**: Check nginx configuration
- **React.js**: Check React documentation
- **Application**: Check the main README.md

## License

This Docker configuration is part of the Project Management Dashboard project. 