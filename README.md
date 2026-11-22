# E-Commerce and Inventory Management System
**Backend Development Capstone | Node.js, Express.js, MongoDB, Mongoose**

## Project selection
This implementation completes **Project 4: E-Commerce and Inventory Management System** from the supplied capstone brief. It implements customer, seller and administrator roles; product catalogue; category management; cart; order workflow; inventory controls; reports; JWT authentication; and real-time events.

## Requirements
- Node.js 18+
- MongoDB Community Server or MongoDB Atlas URI
- Postman for API verification

## Setup
1. Extract the ZIP and open this folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set strong random secrets:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_capstone
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_different_long_random_refresh_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```
4. Start MongoDB.
5. Run `npm run seed` to create sample accounts, categories and products.
6. Run `npm run dev`. API: `http://localhost:5000`.

### Demo accounts
- Admin: `admin@example.com` / `AdminPass123!`
- Seller: `seller@example.com` / `SellerPass123!`
- Customer: `customer@example.com` / `CustomerPass123!`

Change demo passwords before any public deployment. The seed script resets only these demo accounts/categories and the seeded seller's products.

## Main API routes
All protected endpoints require `Authorization: Bearer ACCESS_TOKEN`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register customer |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public + refresh token | Rotate tokens |
| POST | `/api/auth/logout` | Authenticated | Invalidate refresh token |
| GET | `/api/auth/me` | Authenticated | Current profile |
| GET | `/api/categories` | Public | List categories |
| POST/PATCH/DELETE | `/api/categories[/:id]` | Admin | Manage categories |
| GET | `/api/products` | Public | Browse/search/filter/sort/page |
| GET | `/api/products/:id` | Public | Product details |
| POST | `/api/products` | Seller/Admin | Create listing |
| PATCH | `/api/products/:id` | Owner seller/Admin | Update listing |
| DELETE | `/api/products/:id` | Owner seller/Admin | Deactivate listing |
| PATCH | `/api/products/:id/stock` | Owner seller/Admin | Adjust stock |
| GET | `/api/cart` | Customer | View own cart |
| POST | `/api/cart/items` | Customer | Add cart item |
| PATCH | `/api/cart/items/:productId` | Customer | Change quantity |
| DELETE | `/api/cart/items/:productId` | Customer | Remove item |
| POST | `/api/orders` | Customer | Checkout and place order |
| GET | `/api/orders/my` | Customer | Own order history |
| GET | `/api/orders/seller` | Seller/Admin | Seller order list |
| GET | `/api/orders/:id` | Authorized user | Order detail |
| PATCH | `/api/orders/:id/status` | Seller/Admin | Change order status |
| GET | `/api/reports/low-stock` | Seller/Admin | Low stock report |
| GET | `/api/reports/inventory-by-category` | Seller/Admin | Inventory aggregation |
| GET | `/api/reports/sales` | Seller/Admin | Date-wise sales aggregation |
| GET | `/api/reports/best-sellers` | Seller/Admin | Best-selling products |

## Example request bodies

### Register customer
`POST /api/auth/register`
```json
{"name":"Asha Kumar","email":"asha@example.com","password":"AshaPass123!"}
```

### Login
`POST /api/auth/login`
```json
{"email":"customer@example.com","password":"CustomerPass123!"}
```
Copy `accessToken` for the Authorization header and `refreshToken` for refresh.

### Create product (seller)
`POST /api/products`
```json
{
  "name":"Bluetooth Speaker",
  "description":"Portable speaker",
  "price":1499,
  "category":"PASTE_CATEGORY_OBJECT_ID",
  "stock":20,
  "lowStockThreshold":5,
  "sku":"ELE-SPK-005"
}
```
Use a category ID returned by `GET /api/categories`.

### Product search and pagination
`GET /api/products?search=mouse&minPrice=100&maxPrice=2000&sort=price&order=asc&page=1&limit=10`
Optional filters: `search`, `category` (category ObjectId), `minPrice`, `maxPrice`; sort fields: `name`, `price`, `stock`, `createdAt`.

### Cart
`POST /api/cart/items`
```json
{"productId":"PRODUCT_OBJECT_ID","quantity":2}
```

### Checkout
`POST /api/orders`
```json
{"deliveryAddress":"House 10, Example Road, Delhi"}
```
The backend recalculates totals from current database prices and uses a MongoDB transaction with conditional stock decrement. Payment is explicitly simulated; no real payment data is collected.

### Order status
`PATCH /api/orders/ORDER_OBJECT_ID/status`
```json
{"status":"processing"}
```
Allowed transitions: placed → processing or cancelled; processing → shipped or cancelled; shipped → delivered. Cancellation restores item stock.

## Architecture and design
- `routes/`: REST endpoint definitions and request workflow.
- `models/`: Mongoose schemas and indexes.
- `middleware/`: JWT authentication, role checks and centralized error handling.
- `events/`: Node.js EventEmitter internal application events.
- `socket.js`: authenticated Socket.IO connections and per-user rooms.
- `server.js`: Express app, MongoDB connection and Socket.IO server.

### Security
- Passwords are hashed with bcryptjs (12 salt rounds); password field is excluded from normal query results.
- Short-lived JWT access tokens and rotating refresh tokens are implemented. Only a SHA-256 hash of the current refresh token is stored.
- RBAC distinguishes customer, seller and admin. Sellers can modify only their own products/orders.
- Customer cart and order reads are scoped to the authenticated customer.
- `.env` is ignored by Git; do not commit secrets.
- Payment is a simulated academic workflow.

### MongoDB indexes
Indexes include unique user email, unique category name, unique product SKU, product text search, category/price, unique cart customer, order customer/date and order seller/status.

### Aggregation pipelines
1. Inventory by category: groups product stock and inventory value, joins category names.
2. Date-wise sales: groups order items by order date and calculates units/revenue.
3. Best sellers: groups non-cancelled order items and ranks by units sold.

### EventEmitter and Socket.IO
EventEmitter emits `order-placed`, `stock-low` and `order-status-changed`. The listeners deliver authenticated Socket.IO notifications to rooms `user:<id>`. Connect a client with `io("http://localhost:5000", {auth:{token: ACCESS_TOKEN}})`. Events: `connection:ready`, `order:placed`, `seller:new-order`, `inventory:low-stock`, `order:status`.

## Postman test checklist
1. Register a customer; verify password is never returned.
2. Login with valid credentials; verify access and refresh tokens.
3. Login with wrong password; expect 401.
4. Call `/api/auth/me` without token; expect 401.
5. Login as seller and create a product with a valid category ID.
6. Attempt product creation as customer; expect 403.
7. Browse products with search, filters, sort and pagination.
8. Add a product to customer cart; test invalid quantity.
9. Checkout; verify order created and stock decremented.
10. Attempt to buy more than available stock; expect conflict and no negative stock.
11. Verify customer cannot read another customer's order.
12. Change order status as authorized seller; verify invalid transitions are rejected.
13. Cancel an eligible order; verify stock is restored.
14. Run low-stock, inventory-by-category, sales and best-seller reports.
15. Connect a Socket.IO client with a valid token; verify order and low-stock notifications.

## Important implementation note
MongoDB transactions require a replica set (including a single-node local replica set) or MongoDB Atlas. If using a standalone local MongoDB server, configure it as a single-node replica set before testing checkout/cancellation transactions.

## Submission checklist
- Source code and Git repository
- This README and API documentation
- Database design and sample seed data
- Postman collection/screenshots from your own run
- Project report (see `PROJECT_REPORT.md`)
- Demonstration and viva preparation

Do not claim tests or screenshots that have not actually been run/captured in your environment.
