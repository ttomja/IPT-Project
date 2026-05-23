# Chapter 6: Security, Validations & Deployment

## 6.1 Security Measures

### Password Hashing (bcryptjs)
Passwords are **never stored as plain text**. When a user is created, the password goes through `bcrypt.hash(password, 10)`:
- The `10` is the **salt round** — it means the hashing algorithm runs 2^10 = 1,024 iterations.
- This produces a hash like `$2a$10$K6VfE8xLm...` that cannot be reversed back to the original password.
- When logging in, `bcrypt.compare()` hashes the submitted password with the same algorithm and compares the results.

**Why this matters:** If the database is ever compromised, attackers cannot see actual passwords.

### JWT Authentication
- A **JSON Web Token (JWT)** is a digitally-signed string that proves who the user is.
- Structure: `header.payload.signature`
- The payload contains `{ id: "user_id_here" }` and an expiration time.
- The signature is created using the `JWT_SECRET` — only the server knows this secret.
- **Token expiration:** Tokens expire after 1 day (`JWT_EXPIRES_IN: "1d"`), forcing users to log in again.

### CORS (Cross-Origin Resource Sharing)
- The backend only accepts requests from the `CLIENT_URL` (the Vercel frontend URL).
- Requests from any other domain are blocked by the browser.
- This prevents malicious websites from accessing the API.

### Environment Variables
- Sensitive values (database URL, JWT secret, client URL) are stored in `.env` files.
- `.env` files are listed in `.gitignore` and are NEVER committed to GitHub.
- On the hosting platforms (Render, Vercel), these values are set through secure environment variable dashboards.

### Input Sanitization
- Text fields use `trim: true` in Mongoose schemas (removes leading/trailing spaces).
- Product codes are trimmed before duplicate checking.
- All incoming data passes through `express.json()` which only accepts valid JSON.

---

## 6.2 Validation Summary

### Backend Validations (Server-Side)

| Feature | Validation | Error Message |
|---------|-----------|---------------|
| Login | Username and password are required | "Username and password are required." |
| Login | Only Active users can log in | "Invalid username or password." |
| Login | Password must match hash | "Invalid username or password." |
| Create User | fullName, username, password required | "Full name, username, and password are required." |
| Create User | Username must be unique | "Username already exists." |
| Create Category | categoryName required | "Category name is required." |
| Create Category | categoryName must be unique | "Category already exists." |
| Create Product | productCode, productName, categoryId, unitOfMeasure required | "Product code, name, category, and unit are required." |
| Create Product | productCode must be unique | "Product code already exists." |
| Create Product | categoryId must reference an existing category | "Selected category does not exist." |
| Create Product | Numeric fields ≥ 0 | "Numeric values cannot be negative." |
| Update Product | Changed productCode must still be unique | "Product code already exists." |
| Update Product | Numeric fields ≥ 0 | "Numeric values cannot be negative." |
| Stock-In | productId required | "Product is required." |
| Stock-In | quantity must be > 0 and finite | "Quantity must be greater than 0." |
| Stock-In | Product must exist and be Active | "Active product not found." |
| Stock-Out | quantity cannot exceed available stock | "Stock-out quantity cannot exceed available stock." |
| Auth Middleware | JWT token must be present | "Not authorized. Token missing." |
| Auth Middleware | JWT token must be valid | "Not authorized. Token invalid." |
| Auth Middleware | User must be Active | "User is not authorized." |
| Admin Middleware | Role must be Administrator | "Access denied. Administrator only." |

### Frontend Validations (Client-Side)

The frontend performs "early" validation before sending requests to reduce unnecessary API calls:

| Page | Validation |
|------|-----------|
| Login | Username and password must not be empty |
| Users | Full name and username must not be empty |
| Categories | Category name must not be empty |
| Products | Product code, name, and category must not be empty |
| Stock-In | Product must be selected, quantity > 0 |
| Stock-Out | Product must be selected, quantity > 0, quantity ≤ available stock |

> **Important:** Frontend validations are for user convenience only. They can be bypassed by a technical user. The backend validations are the true security layer and cannot be bypassed.

---

## 6.3 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                             │
│                                                              │
│   User opens browser                                        │
│       │                                                      │
│       ▼                                                      │
│   ┌────────────────────────────────────┐                    │
│   │        VERCEL (Frontend)            │                    │
│   │  https://ipt-project-ims-fe.       │                    │
│   │        vercel.app                   │                    │
│   │                                     │                    │
│   │  Serves static React build files   │                    │
│   │  (HTML, CSS, JS bundles)           │                    │
│   └──────────────┬─────────────────────┘                    │
│                  │                                           │
│          API calls (HTTPS)                                  │
│          with JWT in headers                                │
│                  │                                           │
│                  ▼                                           │
│   ┌────────────────────────────────────┐                    │
│   │        VERCEL (Backend)             │                    │
│   │  https://ipt-project-backend-      │                    │
│   │        vercel.vercel.app            │                    │
│   │                                     │                    │
│   │  Runs Express serverless functions │                    │
│   │  Environment Variables:            │                    │
│   │    • MONGO_URI                      │                    │
│   │    • JWT_SECRET                     │                    │
│   │    • CLIENT_URL                     │                    │
│   └──────────────┬─────────────────────┘                    │
│                  │                                           │
│         Mongoose connection (TLS encrypted)                 │
│                  │                                           │
│                  ▼                                           │
│   ┌────────────────────────────────────┐                    │
│   │     MONGODB ATLAS (Database)        │                    │
│   │     Cloud-hosted cluster            │                    │
│   │                                     │                    │
│   │  Database: inventory_management_   │                    │
│   │           system                    │                    │
│   │  IP Whitelist: 0.0.0.0/0          │                    │
│   │  (allows Vercel serverless calls)  │                    │
│   └────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Vercel (Frontend Hosting)
- **What it does:** Hosts the React application as static files.
- **Build command:** `npm run build` (compiles React into optimized HTML/CSS/JS).
- **Environment variable:** `REACT_APP_API_BASE_URL` → points to the Vercel backend.
- **Auto-deploys:** Every push to the `main` branch on GitHub triggers a new deployment.

### Vercel (Backend Hosting)
- **What it does:** Hosts the Express API as Serverless Functions using the `@vercel/node` builder. Configured via `vercel.json` rewrite rules.
- **Build command:** Automatically handled by Vercel.
- **Start command:** Automatically routed through serverless execution.
- **Environment variables:** `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
- **Auto-deploys:** Every push to the `main` branch triggers a new deployment.

### MongoDB Atlas (Database Hosting)
- **What it does:** Stores all application data in the cloud.
- **Cluster:** Free tier (M0 Sandbox).
- **IP Whitelist:** Set to `0.0.0.0/0` to allow Vercel's serverless function instances to connect.
- **Connection:** Uses the `mongodb+srv://` protocol with TLS encryption.

---

## 6.4 Production URLs

| Component | URL |
|-----------|-----|
| Frontend (Main App) | https://ipt-project-ims-fe.vercel.app |
| Frontend (Login) | https://ipt-project-ims-fe.vercel.app/login |
| Backend (API Health) | https://ipt-project-backend-vercel.vercel.app/api/health |
| Backend (API Docs) | https://ipt-project-backend-vercel.vercel.app/api/docs |

---

## 6.5 Key Development Commands

### Backend
| Command | What It Does |
|---------|-------------|
| `npm run dev` | Starts the server with nodemon (auto-restart on code changes) |
| `npm start` | Starts the server for production (no auto-restart) |
| `npm run seed:admin` | Creates the default admin account in the database |
| `npm run seed:sample` | Creates sample categories and products |

### Frontend
| Command | What It Does |
|---------|-------------|
| `npm start` | Starts the React development server on port 3000 |
| `npm run build` | Creates an optimized production build in the `build/` folder |

---

## 6.6 How Swagger API Documentation Works

**File:** `backend/swagger/swagger.js`

Swagger provides a **live, interactive** web page where you can:
1. See all available API endpoints
2. Read their descriptions
3. Try them out directly from the browser (no Postman needed)

**How it works:**
1. The `swagger-jsdoc` library scans all route files for JSDoc comments (the `/** @swagger */` blocks).
2. It generates an OpenAPI 3.0 specification (a JSON description of all routes).
3. The `swagger-ui-express` library renders this spec as an interactive HTML page.
4. The page is served at `/api/docs`.

**Authentication in Swagger:**
The configuration includes a `bearerAuth` security scheme, which adds a green "Authorize" button. Users can paste their JWT token there, and Swagger will include it in all subsequent test requests.

---

## 6.7 Utility Files

### Backend: `utils/validators.js`
Contains reusable validation helper functions:
- `isPositiveNumber(value)` — Returns true if value > 0 and is a finite number
- `isZeroOrPositiveNumber(value)` — Returns true if value ≥ 0 and is a finite number
- `normalizeString(value)` — Trims whitespace from strings

### Frontend: `utils/roles.js`
Defines role constants to avoid magic strings:
```javascript
export const ROLES = {
  ADMIN: "Administrator",
  STAFF: "Staff",
};
```

### Frontend: `services/authService.js`
This file contains a **legacy/temporary** authentication service with hardcoded credentials. It was used during early development before the real backend was built. The ProductsPage still imports `getCurrentUser` from this file to check the user's role for UI visibility.
