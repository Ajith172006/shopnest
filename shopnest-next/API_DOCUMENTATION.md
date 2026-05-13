# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, endpoints are public. For production, implement JWT authentication.

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "data": {},
  "message": "Description"
}
```

---

## Products Endpoints

### Get All Products
```
GET /products
```

**Query Parameters:**
- `category` (string) - Filter by category
- `search` (string) - Search products
- `sort` (string) - Sort: price-low, price-high, rating, newest

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "Product Name",
      "price": 99.99,
      "category": "Electronics",
      "image": "url",
      "stock": 10,
      "rating": 4.5,
      "discount": 10,
      "isFeatured": true
    }
  ]
}
```

### Get Single Product
```
GET /products/:id
```

### Create Product
```
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "originalPrice": 119.99,
  "image": "image-url",
  "category": "Electronics",
  "stock": 10,
  "discount": 10,
  "tags": ["new", "bestseller"],
  "isFeatured": true
}
```

### Update Product
```
PUT /products/:id
Content-Type: application/json

{
  "price": 89.99,
  "stock": 5
}
```

### Delete Product
```
DELETE /products/:id
```

---

## Users Endpoints

### Register
```
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile
```
GET /users/:id
```

### Update Profile
```
PUT /users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "country": "USA"
  }
}
```

### Add to Wishlist
```
POST /users/:id/wishlist/:productId
```

### Remove from Wishlist
```
DELETE /users/:id/wishlist/:productId
```

---

## Orders Endpoints

### Create Order
```
POST /orders
Content-Type: application/json

{
  "userId": "user-id",
  "items": [
    {
      "productId": "product-id",
      "name": "Product",
      "price": 99.99,
      "quantity": 2,
      "image": "url"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "country": "USA"
  },
  "subtotal": 199.98,
  "shippingCost": 10,
  "discount": 20,
  "tax": 27.20,
  "totalAmount": 217.18,
  "paymentMethod": "credit-card"
}
```

### Get User Orders
```
GET /orders/user/:userId
```

### Get Single Order
```
GET /orders/:id
```

### Update Order Status
```
PUT /orders/:id
Content-Type: application/json

{
  "orderStatus": "shipped",
  "trackingNumber": "TRACK123456"
}
```

### Cancel Order
```
DELETE /orders/:id
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Testing with cURL

```bash
# Get all products
curl http://localhost:5000/api/products

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99,"category":"Electronics",...}'

# Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

---

## Notes for Frontend Integration

1. Use `NEXT_PUBLIC_API_BASE_URL` environment variable for API calls
2. Example: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
3. Handle errors in try-catch blocks
4. Store user IDs after login for subsequent requests
5. Send JSON content-type headers for POST/PUT requests
