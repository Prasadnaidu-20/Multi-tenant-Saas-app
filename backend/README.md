# Multi-Tenant SaaS Backend

A Node.js/Express backend for a multi-tenant SaaS notes application with MongoDB and JWT authentication.

## Features

- 🔐 JWT-based authentication
- 🏢 Multi-tenant architecture
- 👥 Role-based access control (Admin/Member)
- 🗄️ MongoDB database integration
- 🛡️ Password hashing with bcryptjs
- 🌐 CORS enabled for frontend integration
- 📝 Express.js REST API

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/multi-tenant-saas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "tenantId": "Acme"
  }
  ```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required),
  password: String (required),
  tenantId: String (required),
  role: String (enum: ['Admin', 'Member'], default: 'Member')
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/multi-tenant-saas |
| `JWT_SECRET` | JWT signing secret | (required) |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3000 |

## Project Structure

```
backend/
├── middleware/          # Custom middleware
│   └── roleAuth.js     # Role-based authentication
├── models/             # Database models
│   └── User.js         # User schema
├── routes/             # API routes
│   └── auth.js         # Authentication routes
├── server.ts           # Main server file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── env.example         # Environment variables template
```

## Development

The server uses TypeScript and ES modules. Key features:

- **Hot reload**: Use `npm run dev` for automatic restarts
- **Type safety**: Full TypeScript support
- **ES modules**: Modern JavaScript module system
- **Error handling**: Global error middleware
- **Graceful shutdown**: Proper cleanup on server stop

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Input validation
- Environment variable protection

## Next Steps

- [ ] Implement user registration
- [ ] Add notes CRUD operations
- [ ] Implement subscription management
- [ ] Add admin panel endpoints
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add API documentation

