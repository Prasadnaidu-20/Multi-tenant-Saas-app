# Docker Setup for Multi-Tenant SaaS Application

This guide will help you run the Multi-Tenant SaaS application using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd Multi-tenant-SAAS-application
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Services

### MongoDB Database
- **Container**: `multi-tenant-mongodb`
- **Port**: 27017
- **Credentials**: admin/password123
- **Database**: multi-tenant-saas

### Backend API
- **Container**: `multi-tenant-backend`
- **Port**: 5000
- **Health Check**: http://localhost:5000/api/health

### Frontend Next.js App
- **Container**: `multi-tenant-frontend`
- **Port**: 3000

## Environment Variables

The Docker Compose file includes the following environment variables:

### Backend
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=mongodb://admin:password123@mongodb:27017/multi-tenant-saas?authSource=admin`
- `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`
- `CORS_ORIGIN=http://localhost:3000`

### Frontend
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=http://localhost:5000`

## Useful Commands

### Start services
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ This will delete all data)
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose up --build -d
```

### Access MongoDB shell
```bash
docker exec -it multi-tenant-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

### Access backend container
```bash
docker exec -it multi-tenant-backend sh
```

### Access frontend container
```bash
docker exec -it multi-tenant-frontend sh
```

## Database Initialization

The MongoDB container automatically initializes with:
- Database: `multi-tenant-saas`
- Collections: `users`, `notes`, `invitations`
- Indexes for optimal performance

## Production Considerations

1. **Change default passwords** in `docker-compose.yml`
2. **Use environment files** for sensitive data
3. **Enable SSL/TLS** for production
4. **Use Docker secrets** for sensitive information
5. **Set up proper logging** and monitoring
6. **Configure backup strategies** for MongoDB

## Troubleshooting

### Port conflicts
If you get port conflicts, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Frontend on port 3001
  - "5001:5000"  # Backend on port 5001
```

### MongoDB connection issues
Check if MongoDB is running:
```bash
docker-compose ps
docker-compose logs mongodb
```

### Build issues
Clear Docker cache and rebuild:
```bash
docker-compose down
docker system prune -f
docker-compose up --build -d
```

## Development vs Production

### Development
- Use `docker-compose up` for development
- Mount source code as volumes for hot reloading
- Use development environment variables

### Production
- Use `docker-compose -f docker-compose.prod.yml up -d`
- Build optimized images
- Use production environment variables
- Enable health checks and restart policies
