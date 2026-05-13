# MongoDB & Express Backend Setup Guide

## 📋 Overview

Your e-commerce backend has been set up with:
- **Express.js** - REST API server
- **MongoDB Atlas** - Cloud database (FREE tier available)
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password encryption
- **CORS** - Cross-origin requests support

## 🚀 Quick Start

### Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** (or Sign In if you have an account)
3. Create a **FREE** account with email/password
4. Create a new project
5. Create a new cluster:
   - Select **M0 (Free)** tier
   - Choose your preferred region
   - Click **Create Cluster**
6. Set up Database Access:
   - Click **Database Access** in the left menu
   - Click **Add New Database User**
   - Username: `shopnest`
   - Password: Generate a strong password (save it!)
   - Select **Built-in Role: readWriteAnyDatabase**
   - Click **Add User**
7. Set up Network Access:
   - Click **Network Access** in the left menu
   - Click **Add IP Address**
   - Select **Allow access from anywhere** (for development)
   - Click **Confirm**
8. Get Connection String:
   - Click **Clusters** in the left menu
   - Click **Connect** on your cluster
   - Select **Drivers**
   - Copy the connection string

### Step 2: Update Environment Variables

Edit `.env.local` file:

```env
MONGODB_URI=mongodb+srv://shopnest:YOUR_PASSWORD@cluster.mongodb.net/shopnest?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Replace:
- `YOUR_PASSWORD` with the password you created for the database user

### Step 3: Install Dependencies

```bash
cd shopnest-next
npm install
```

### Step 4: Start the Backend Server

#### Development (with auto-reload):
```bash
npm run server:dev
```

#### Production:
```bash
npm run server:prod
```

You should see:
```
✓ Server running on http://localhost:5000
✓ MongoDB connected successfully
```

### Step 5: Start the Next.js Frontend (in another terminal)

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`
Backend runs on: `http://localhost:5000/api`

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products (with search, filter, sort)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

**Query Params for GET /api/products:**
- `category` - Filter by category (Electronics, Fashion, Home, etc.)
- `search` - Search by name or description
- `sort` - Sort by: price-low, price-high, rating, newest

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/:id/wishlist/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## 🗂️ Project Structure

```
api/
├── config/
│   └── mongodb.js          # MongoDB connection
├── models/
│   ├── Product.js          # Product schema
│   ├── User.js             # User schema
│   └── Order.js            # Order schema
├── routes/
│   ├── products.js         # Product endpoints
│   ├── users.js            # User endpoints
│   └── orders.js           # Order endpoints
├── middleware/             # Custom middleware (ready for use)
└── server.js              # Express app setup
```

## 📝 Example API Usage

### Register User
```javascript
const response = await fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
```

### Get All Products
```javascript
const response = await fetch('http://localhost:5000/api/products?category=Electronics&sort=price-low');
const products = await response.json();
```

### Create Order
```javascript
const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-id-here',
    items: [
      {
        productId: 'product-id',
        quantity: 2,
        price: 100
      }
    ],
    shippingAddress: { /* ... */ },
    totalAmount: 200,
    paymentMethod: 'credit-card'
  })
});
```

## 🔑 MongoDB Atlas Tips

- **Free Tier Limits:** 512 MB storage, 1 million transactions/month
- **Auto-backups:** Available in M1+ clusters
- **Monitoring:** Available in the Cloud console
- **Scaling:** Upgrade to paid tier when needed

## 🛠️ Common Issues & Solutions

### Issue: "MONGODB_URI is not defined"
**Solution:** Check `.env.local` file exists and has MONGODB_URI set correctly

### Issue: "connect ECONNREFUSED"
**Solution:** 
1. Verify MongoDB Atlas cluster is running
2. Check network access allows your IP
3. Verify connection string is correct

### Issue: "Authentication failed"
**Solution:**
1. Check username and password in connection string
2. Ensure database user was created with readWriteAnyDatabase role
3. Verify special characters are URL-encoded in password

### Issue: "Cannot POST /api/products" 
**Solution:** Ensure backend server is running on port 5000

## 📦 Dependencies Explained

- **express** - Web framework for building APIs
- **mongoose** - MongoDB object modeling
- **bcryptjs** - Secure password hashing
- **cors** - Enable cross-origin requests
- **dotenv** - Load environment variables
- **nodemon** - Auto-reload server during development

## ✅ Next Steps

1. Install dependencies: `npm install`
2. Update `.env.local` with MongoDB URI
3. Start backend: `npm run server:dev`
4. Start frontend: `npm run dev`
5. Test endpoints using Postman or cURL
6. Connect your frontend components to API endpoints

## 📞 Need Help?

- Check MongoDB Atlas documentation: https://docs.mongodb.com/
- Express.js guide: https://expressjs.com/
- Mongoose documentation: https://mongoosejs.com/

Happy coding! 🎉
