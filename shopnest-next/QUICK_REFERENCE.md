# Quick Reference - Common Commands

## Installation & Setup

```bash
# Navigate to project
cd shopnest-next

# Install all dependencies
npm install

# Copy env template and update with your MongoDB URI
copy .env.example .env.local
```

## Running the Application

```bash
# Terminal 1: Start backend server (development)
npm run server:dev

# Terminal 2: Start frontend (Next.js)
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Database Operations

```bash
# Seed database with sample products
node api/seed.js

# Connect to MongoDB Atlas directly
# Open MongoDB Atlas > Clusters > Connect > MongoDB Compass
# Use connection string from .env.local
```

## Testing API Endpoints

### Using cURL

```bash
# Test server health
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products

# Get products with filters
curl "http://localhost:5000/api/products?category=Electronics&sort=price-low"

# Create a new product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 999,
    "image": "https://via.placeholder.com/300",
    "category": "Electronics",
    "stock": 10
  }'

# Register a new user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login user
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import endpoints collection (create requests manually)
3. Set Base URL to `http://localhost:5000/api`
4. Test each endpoint

**Example Postman Setup:**
- Method: GET
- URL: `{{base_url}}/products`
- Headers: Content-Type: application/json

## Development Tips

```bash
# Restart backend with automatic reload (on file changes)
npm run server:dev

# Run backend in production mode
npm run server:prod

# Check for linting errors
npm run lint

# Build frontend for production
npm run build

# Start production frontend
npm start
```

## Debugging

```bash
# View MongoDB logs
# Check terminal where server is running

# View API request logs
# Each request will show in server terminal:
# 2024-01-10 14:30:45 GET /api/products

# Check Node version
node --version

# Check npm version
npm --version
```

## File Structure Reference

```
shopnest-next/
├── api/
│   ├── config/
│   │   └── mongodb.js         ← DB connection
│   ├── models/
│   │   ├── Product.js         ← Product schema
│   │   ├── User.js            ← User schema
│   │   └── Order.js           ← Order schema
│   ├── routes/
│   │   ├── products.js        ← Product endpoints
│   │   ├── users.js           ← User endpoints
│   │   └── orders.js          ← Order endpoints
│   ├── server.js              ← Main server file
│   └── seed.js                ← Sample data script
├── app/
│   ├── page.js                ← Homepage
│   ├── layout.js              ← App layout
│   └── globals.css            ← Global styles
├── components/
│   ├── ProductCard.jsx        ← Product component
│   ├── CartPanel.jsx          ← Cart component
│   └── ... (other components)
├── context/
│   └── StoreContext.jsx       ← Global state
├── .env.local                 ← Environment variables
└── package.json               ← Dependencies
```

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| `Cannot connect to MongoDB` | Check .env.local has correct MONGODB_URI |
| `Port 5000 already in use` | Change PORT in .env.local or kill process on port 5000 |
| `Dependencies not installed` | Run `npm install` |
| `Next.js errors` | Clear `.next` folder and rebuild |
| `Seed script fails` | Ensure MongoDB connection is working |

## Environment Variables

**Required in .env.local:**
```
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Performance Tips

1. **Use indexes:** Already set up in models (category, isFeatured)
2. **Pagination:** Add limit/skip params to GET endpoints for large datasets
3. **Caching:** Use Next.js ISR or API caching headers
4. **Database queries:** Use `.select()` to fetch only needed fields
5. **Connection pooling:** Mongoose handles this automatically

## Security Notes

- ⚠️ Never commit `.env.local` to git
- ⚠️ Use strong passwords for MongoDB user
- ⚠️ Enable IP whitelisting in MongoDB Atlas
- ⚠️ Add authentication middleware before production
- ⚠️ Validate user input on backend
- ⚠️ Use HTTPS in production

## Need More Help?

- MongoDB Setup: Read [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- API Details: Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Express docs: https://expressjs.com
- Mongoose docs: https://mongoosejs.com
- Next.js docs: https://nextjs.org
