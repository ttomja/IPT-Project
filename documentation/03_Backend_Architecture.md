# Chapter 3: Backend Architecture

## 3.1 How the Backend Starts

**File:** `backend/app.js`

When you run `npm start` (or `npm run dev` for development), Node.js executes `app.js`. Here is exactly what happens, step by step:

### Step 1: Load Environment Variables
```javascript
require("dotenv").config();
```
This reads the `.env` file and makes its values available as `process.env.VARIABLE_NAME`. For example, `process.env.MONGO_URI` becomes the database connection string.

### Step 2: Import Dependencies
```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
```
- **express** creates the web server.
- **cors** enables the frontend (on a different domain) to communicate with the backend.
- **mongoose** provides the database connection status for the health endpoint.

### Step 3: Import Route Handlers
```javascript
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
// ... and so on for categories, products, stock, reports
```
Each route file defines which URLs are available and which controller function handles each one.

### Step 4: Create the Express App and Connect to Database
```javascript
const app = express();
connectDB();
```
`connectDB()` is called from `config/db.js` and connects to MongoDB Atlas using the connection string from the `.env` file.

### Step 5: Configure Middleware
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
```
- **CORS middleware** tells the server: "Only accept requests from this specific frontend URL." This is a security measure. The `CLIENT_URL` is set to the Vercel deployment URL in production.
- **express.json()** tells Express: "Automatically parse incoming JSON request bodies." Without this, `req.body` would be `undefined`.

### Step 6: Register Routes
```javascript
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```
This maps URL prefixes to route files. For example, when a request arrives at `/api/products`, Express hands it off to `productRoutes.js` to determine the exact handler.

### Step 7: Start Listening
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
The server starts listening on port 5000 (locally) or runs inside a serverless handler when deployed to Vercel (which intercepts requests and executes them as serverless functions).

---

## 3.2 The Request-Response Flow

When the frontend sends a request (e.g., `GET /api/products`), it flows through the backend like this:

```
Incoming HTTP Request
        │
        ▼
┌─────────────────┐
│  CORS Middleware │ → Checks: Is this request from an allowed origin?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Parser    │ → Converts the raw request body into a JavaScript object
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Router         │ → Matches the URL to the correct route file
│  (app.use)      │   e.g., /api/products → productRoutes.js
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware │ → Extracts JWT token from the Authorization header
│  (protect)      │ → Verifies the token is valid and not expired
│                 │ → Looks up the user in the database
│                 │ → Attaches user info to req.user
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Role Middleware │ → (Optional) Checks if req.user.role is "Administrator"
│  (adminOnly)    │ → Returns 403 Forbidden if not
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controller     │ → Executes business logic
│  Function       │ → Queries/updates the database using Mongoose models
│                 │ → Sends back a JSON response
└─────────────────┘
```

---

## 3.3 Authentication & Authorization Middleware

**File:** `backend/middleware/authMiddleware.js`

This file contains two middleware functions that act as **gatekeepers** before any request reaches a controller.

### The `protect` Middleware (Authentication)

**What it does:** Verifies that the person making the request is logged in.

**Step-by-step:**
1. Reads the `Authorization` header from the incoming request.
2. Checks that it starts with `"Bearer "` (the industry standard format).
3. Extracts the JWT token (everything after "Bearer ").
4. Calls `jwt.verify()` to decode and validate the token using `JWT_SECRET`.
5. Uses the decoded user ID to look up the user in the database.
6. Checks that the user exists AND their status is `"Active"`.
7. If everything passes, attaches the full user object to `req.user` and calls `next()` to proceed.
8. If anything fails, returns a `401 Unauthorized` response.

**Why this matters:** Without this middleware, anyone on the internet could access the API without logging in.

### The `adminOnly` Middleware (Authorization)

**What it does:** Checks that the logged-in user has the `"Administrator"` role.

**Step-by-step:**
1. Reads `req.user.role` (which was set by the `protect` middleware).
2. If the role is NOT `"Administrator"`, returns a `403 Forbidden` response.
3. If it IS, calls `next()` to proceed.

**Why this matters:** Some operations (like creating users or deleting products) should only be available to admins. This middleware enforces that rule.

### How Routes Use These Middlewares

```javascript
// In userRoutes.js — ALL user routes require admin access:
router.use(protect);       // Step 1: Must be logged in
router.use(adminOnly);     // Step 2: Must be an administrator
router.get("/", getUsers); // Step 3: Only then can they see users

// In productRoutes.js — Mixed access:
router.get("/", protect, getProducts);              // Any logged-in user can view
router.post("/", protect, adminOnly, createProduct); // Only admins can create
```

---

## 3.4 Authentication Controller

**File:** `backend/controllers/authController.js`

### `login` — POST /api/auth/login

**What it does:** Authenticates a user and returns a JWT token.

**Step-by-step:**
1. Extracts `username` and `password` from the request body.
2. Validates that both fields are provided (returns 400 if not).
3. Searches the database for a user with that username AND status `"Active"`.
4. If no user is found, returns 401 with a vague message ("Invalid username or password.") — intentionally vague to not reveal whether the username exists.
5. Uses `bcrypt.compare()` to check the submitted password against the stored hash.
6. If the password doesn't match, returns 401.
7. Generates a JWT token using `jwt.sign()`, embedding the user's `_id` as the payload.
8. Returns the token and a safe subset of user data (no password field).

**Request Body:**
```json
{ "username": "admin", "password": "admin123" }
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "664a...",
    "fullName": "System Administrator",
    "username": "admin",
    "role": "Administrator",
    "status": "Active"
  }
}
```

### `getMe` — GET /api/auth/me

**What it does:** Returns the currently logged-in user's profile.

**How it works:** The `protect` middleware already looked up the user and attached it to `req.user`. This controller simply returns that data. It is used by the frontend to verify a session is still valid.

---

## 3.5 User Controller

**File:** `backend/controllers/userController.js`

All routes require `protect` + `adminOnly` middleware (defined in `userRoutes.js`).

### `getUsers` — GET /api/users

**What it does:** Returns all user accounts.

**Key details:**
- Uses `.select("-password")` to exclude the password hash from the response (security).
- Sorts by `createdAt: -1` (newest first).

### `createUser` — POST /api/users

**What it does:** Creates a new user account.

**Validations:**
1. `fullName`, `username`, and `password` are required.
2. Checks for duplicate username (returns 400 if already taken).
3. Hashes the password with bcrypt (salt round 10) before saving.
4. Defaults role to `"Staff"` if not specified.

### `updateUser` — PUT /api/users/:id

**What it does:** Updates an existing user's details.

**Key details:**
- Uses the **nullish coalescing operator** (`??`): only updates a field if a new value is provided. If the frontend sends `null` or `undefined`, the existing value is kept.
- This is also used for the **Activate** feature: the frontend calls `updateUser(id, { status: "Active" })` to reactivate a deactivated user.

### `deactivateUser` — PATCH /api/users/:id/deactivate

**What it does:** Sets a user's status to `"Inactive"`.

**Key details:**
- Uses PATCH (not DELETE) because it's a partial update, not a full deletion.
- Deactivated users cannot log in (the login controller checks for `status: "Active"`).
- This is a **soft delete** — the user record is preserved in the database for audit purposes.

---

## 3.6 Category Controller

**File:** `backend/controllers/categoryController.js`

### `getCategories` — GET /api/categories

**What it does:** Returns all active categories, sorted alphabetically by name.

**Key detail:** Only returns categories where `status: "Active"`. This means deactivated categories are hidden from product forms and listings.

**Access:** Any logged-in user (protect middleware only).

### `createCategory` — POST /api/categories

**What it does:** Creates a new category.

**Validations:**
1. `categoryName` is required.
2. Checks for duplicate category names (returns 400 if already exists).

**Access:** Admin only.

### `updateCategory` — PUT /api/categories/:id

**What it does:** Updates a category's name, description, or status.

**Access:** Admin only.

---

## 3.7 Product Controller

**File:** `backend/controllers/productController.js`

### `getProducts` — GET /api/products

**What it does:** Returns all active products with optional search and category filtering.

**Query Parameters:**
- `search` — Filters products by name OR code (case-insensitive regex match).
- `categoryId` — Filters products by category.

**Key details:**
- Uses `.populate("categoryId", "categoryName")` to replace the raw ObjectId with the actual category name in the response.
- Sorts alphabetically by product name.
- Only returns products where `status: "Active"`.

### `createProduct` — POST /api/products

**What it does:** Creates a new product.

**Validations (there are 5 layers):**
1. `productCode`, `productName`, `categoryId`, and `unitOfMeasure` are required.
2. Checks for duplicate product code.
3. Verifies the referenced category actually exists in the database.
4. Checks that all numeric fields (`quantityInStock`, `reorderLevel`, `price`) are not negative.
5. Trims whitespace from text fields.

### `updateProduct` — PUT /api/products/:id

**What it does:** Updates an existing product.

**Validations:**
1. If the product code is being changed, checks for duplicates (excluding the current product).
2. Validates that numeric fields are not negative.
3. Uses `Object.assign()` to merge the request body into the existing product.

### `deactivateProduct` — PATCH /api/products/:id/deactivate

**What it does:** Soft-deletes a product by setting its status to `"Inactive"`.

---

## 3.8 Stock Controller

**File:** `backend/controllers/stockController.js`

This is the most critical controller because it modifies product quantities and creates permanent transaction records.

### `stockIn` — POST /api/stock/in

**What it does:** Adds inventory to a product.

**Step-by-step flow:**
1. Extracts `productId`, `quantity`, and `remarks` from the request body.
2. Converts `quantity` to a number and validates it (must be a positive finite number).
3. Looks up the product and verifies it exists and is Active.
4. Records the `previousQuantity` (current stock count).
5. Calculates `newQuantity = previousQuantity + quantity`.
6. Updates the product's `quantityInStock` field.
7. Creates a `StockTransaction` document with all the details.
8. The `processedBy` field is automatically set to `req.user._id` (the logged-in user).

**Request Body:**
```json
{ "productId": "664b...", "quantity": 25, "remarks": "Monthly restock" }
```

### `stockOut` — POST /api/stock/out

**What it does:** Removes inventory from a product.

**Same as stockIn, but with one critical extra validation:**
- **Step 5 (additional):** Checks that the requested quantity does not exceed the available stock. If someone tries to remove 50 units from a product that only has 30, it returns a 400 error: "Stock-out quantity cannot exceed available stock."

**The math:** `newQuantity = previousQuantity - quantity`

### `getTransactions` — GET /api/stock/transactions

**What it does:** Returns the full history of stock movements.

**Query Parameters:**
- `type` — Filter by "Stock In" or "Stock Out" or "All".
- `productId` — Filter by a specific product.

**Key details:**
- Uses `.populate()` on both `productId` and `processedBy` to show product names and user names instead of raw IDs.
- Sorted by `createdAt: -1` (most recent first).

---

## 3.9 Report Controller

**File:** `backend/controllers/reportController.js`

### `getCurrentInventoryReport` — GET /api/reports/inventory

Returns all active products with their current stock levels and category names.

### `getLowStockReport` — GET /api/reports/low-stock

Returns only products where `quantityInStock ≤ reorderLevel`. Uses MongoDB's `$expr` operator to compare two fields within the same document:
```javascript
$expr: { $lte: ["$quantityInStock", "$reorderLevel"] }
```
This is a powerful MongoDB feature — it compares the value of one field against another field in the same document.

### `getStockInReport` — GET /api/reports/stock-in

Returns all "Stock In" transactions with product and user details.

### `getStockOutReport` — GET /api/reports/stock-out

Returns all "Stock Out" transactions with product and user details.

---

## 3.10 Complete API Endpoint Reference

### Authentication (No middleware required for login)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Authenticate and receive JWT token |
| GET | `/api/auth/me` | Logged-in | Get current user profile |

### Users (All require Admin access)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create a new user |
| PUT | `/api/users/:id` | Admin | Update user details / Activate user |
| PATCH | `/api/users/:id/deactivate` | Admin | Deactivate a user |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Logged-in | List all active categories |
| POST | `/api/categories` | Admin | Create a new category |
| PUT | `/api/categories/:id` | Admin | Update a category |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Logged-in | List products (with search and filter) |
| POST | `/api/products` | Admin | Create a new product |
| PUT | `/api/products/:id` | Admin | Update a product |
| PATCH | `/api/products/:id/deactivate` | Admin | Deactivate a product |

### Stock
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/stock/in` | Logged-in | Record stock-in transaction |
| POST | `/api/stock/out` | Logged-in | Record stock-out transaction |
| GET | `/api/stock/transactions` | Logged-in | List all transactions |

### Reports
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/reports/inventory` | Logged-in | Current inventory report |
| GET | `/api/reports/low-stock` | Logged-in | Low stock alert report |
| GET | `/api/reports/stock-in` | Logged-in | Stock-in history report |
| GET | `/api/reports/stock-out` | Logged-in | Stock-out history report |

### System
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/health` | Public | Server status and database connection check |
| GET | `/api/docs` | Public | Swagger interactive API documentation |

---

## 3.11 Environment Variables

**File:** `backend/.env`

| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `PORT` | `5000` | The port the server listens on |
| `CLIENT_URL` | `https://ipt-project-ims-fe.vercel.app` | The frontend URL allowed by CORS |
| `MONGO_URI` | `mongodb+srv://...` | The MongoDB Atlas connection string |
| `JWT_SECRET` | `ims_week_12_secret_key_change_later` | The secret key used to sign/verify JWT tokens |
| `JWT_EXPIRES_IN` | `1d` | How long a JWT token is valid (1 day) |

> **Important:** The `.env` file is listed in `.gitignore`, which means it is NEVER uploaded to GitHub. This is a critical security practice — you never want database passwords or secret keys in your public repository.

---

## 3.12 Seed Scripts

**Files:** `backend/seeds/seedAdmin.js` and `backend/seeds/seedSampleData.js`

These are standalone scripts (not part of the running server) that populate the database with initial data.

### `seedAdmin.js` (Run with: `npm run seed:admin`)
1. Connects directly to MongoDB.
2. Checks if a user with username `"admin"` already exists.
3. If not, creates the System Administrator account with a hashed password.
4. Disconnects from the database.

### `seedSampleData.js` (Run with: `npm run seed:sample`)
1. Creates or updates two categories: "Office Supplies" and "Cleaning Supplies".
2. Creates or updates two products: "Bond Paper" (P-001) and "Alcohol" (P-002).
3. Uses `findOneAndUpdate` with `upsert: true`, which means:
   - If the document exists, update it.
   - If it doesn't exist, create it.
   - This makes the script safe to run multiple times without creating duplicates.
