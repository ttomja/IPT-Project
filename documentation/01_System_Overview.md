# Chapter 1: System Overview

## 1.1 What Is This System?

The **Inventory Management System (IMS)** is a web-based application that helps an organization track its physical products — what items they have, how many are in stock, when stock comes in, and when stock goes out.

Think of it like a digital warehouse notebook. Instead of writing product counts on paper, the system stores everything in a database and provides a clean web interface for managing it.

## 1.2 What Problem Does It Solve?

Without this system, a business would need to:
- Manually count every product on shelves
- Write stock changes on paper (easy to lose or make mistakes)
- Have no quick way to know which products are running low
- Have no record of who moved stock in or out, and when

This system solves all of those problems by:
- **Storing product information digitally** (name, code, category, quantity, price)
- **Tracking every stock movement** (who added stock, who removed it, how much, and when)
- **Alerting users to low-stock products** (when quantity drops at or below a set reorder level)
- **Controlling access with roles** (only Administrators can create products or manage users)

## 1.3 Who Uses This System?

There are exactly two types of users (called "roles"):

| Role | What They Can Do |
|------|-----------------|
| **Administrator** | Full access. Can manage users, create/edit/deactivate categories and products, record stock-in and stock-out, view all transactions and reports. |
| **Staff** | Limited access. Can view products, record stock-in and stock-out, and view transactions and reports. Cannot manage users, categories, or create/edit products. |

## 1.4 Technology Stack

The system is built using a **modern full-stack JavaScript architecture**, which means the same programming language (JavaScript) is used in both the front-end and back-end.

### Frontend (What the user sees and clicks)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.5 | A JavaScript library for building user interfaces using reusable components |
| **React Router DOM** | 7.15.1 | Handles navigation between pages (e.g., from Login to Dashboard) without reloading |
| **Axios** | 1.16.1 | Sends HTTP requests from the browser to the backend API |
| **Create React App** | 5.0.1 | The build tool that compiles and bundles the React code |

### Backend (The server that processes data behind the scenes)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | — | The runtime that lets JavaScript run on a server (not just in a browser) |
| **Express** | 5.2.1 | A web framework that creates the API endpoints (URLs the frontend talks to) |
| **Mongoose** | 9.6.2 | An ODM (Object-Document Mapper) that makes it easy to interact with MongoDB |
| **bcryptjs** | 3.0.3 | Hashes (encrypts) passwords so they are never stored as plain text |
| **jsonwebtoken** | 9.0.3 | Creates and verifies JWT tokens for user authentication |
| **cors** | 2.8.6 | Allows the frontend (on a different domain) to talk to the backend |
| **dotenv** | 17.4.2 | Loads secret configuration values from a `.env` file |
| **Swagger** | 6.2.8 / 5.0.1 | Auto-generates interactive API documentation |
| **nodemon** | 3.1.14 | (Dev only) Automatically restarts the server when code changes |

### Database
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | A cloud-hosted NoSQL database that stores all the data (users, products, categories, transactions) |

### Deployment
| Service | What It Hosts |
|---------|--------------|
| **Vercel** | Both the frontend React application and the backend Express API server (deployed as serverless functions) |

## 1.5 How Does the System Work at a High Level?

Here is the flow of what happens when a user interacts with the system:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│   React Frontend (Vercel)                                       │
│   ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │ LoginPage │  │Dashboard │  │Products  │  │Stock-In  │ ... │
│   └─────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│         │              │              │              │           │
│         └──────────────┴──────────────┴──────────────┘           │
│                              │                                   │
│                     Axios HTTP Requests                          │
│                    (with JWT token attached)                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND (Vercel)                    │
│                                                                  │
│   app.js ──► Middleware (CORS, JSON parser)                      │
│          ──► Auth Middleware (verify JWT token)                   │
│          ──► Route Handler (e.g., GET /api/products)             │
│          ──► Controller (business logic)                         │
│          ──► Mongoose Model (database query)                     │
│                              │                                   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS (Cloud)                       │
│                                                                  │
│   Collections:  users │ categories │ products │ stocktransactions│
└──────────────────────────────────────────────────────────────────┘
```

**In plain English:**
1. The user opens the website in their browser (React frontend on Vercel).
2. They type their username and password and click "Login".
3. The frontend sends a request to the backend API (Express on Vercel).
4. The backend checks the credentials against the database (MongoDB Atlas).
5. If correct, the backend creates a JWT token and sends it back.
6. The frontend saves this token in the browser's localStorage.
7. Every future request (e.g., "show me all products") automatically includes this token.
8. The backend verifies the token, processes the request, queries MongoDB, and sends the data back.
9. The frontend displays the data in a nice table or card layout.

## 1.6 Project Folder Structure

```
IPT-Project/
│
├── backend/                        ← The server-side code
│   ├── app.js                      ← Entry point: starts the server
│   ├── package.json                ← Lists backend dependencies
│   ├── .env                        ← Secret config (DB password, JWT key)
│   │
│   ├── config/
│   │   └── db.js                   ← Database connection logic
│   │
│   ├── models/                     ← Database schema definitions
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── StockTransaction.js
│   │
│   ├── controllers/                ← Business logic for each feature
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── stockController.js
│   │   └── reportController.js
│   │
│   ├── routes/                     ← URL definitions (which URL → which controller)
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── stockRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       ← JWT verification & role checking
│   │
│   ├── seeds/                      ← Scripts to populate initial data
│   │   ├── seedAdmin.js
│   │   └── seedSampleData.js
│   │
│   ├── swagger/
│   │   └── swagger.js              ← API documentation config
│   │
│   └── utils/
│       └── validators.js           ← Helper functions for validation
│
├── frontend/                       ← The client-side code
│   ├── package.json                ← Lists frontend dependencies
│   ├── .env                        ← API URL config
│   │
│   └── src/
│       ├── App.js                  ← Root component: defines all routes
│       ├── App.css                 ← Global styles for all pages
│       ├── index.js                ← React entry point
│       │
│       ├── api/                    ← Functions that call the backend API
│       │   ├── axiosClient.js      ← Configured Axios instance
│       │   ├── authService.js      ← Login & get-current-user calls
│       │   ├── productsApi.js      ← Product CRUD calls
│       │   ├── categoriesApi.js    ← Category CRUD calls
│       │   ├── usersApi.js         ← User CRUD calls
│       │   ├── stockApi.js         ← Stock-in, stock-out, transactions
│       │   └── reportsApi.js       ← Report data calls
│       │
│       ├── components/             ← Reusable UI building blocks
│       │   ├── DashboardCard.js
│       │   ├── PageHeader.js
│       │   ├── StatusBadge.js
│       │   ├── EmptyState.js
│       │   ├── ErrorMessage.js
│       │   ├── LoadingMessage.js
│       │   └── SuccessMessage.js
│       │
│       ├── layouts/                ← Page layout wrappers
│       │   ├── MainLayout.js       ← Sidebar + content area
│       │   └── Sidebar.js          ← Navigation sidebar
│       │
│       ├── pages/                  ← Full page components
│       │   ├── LoginPage.js
│       │   ├── DashboardPage.js
│       │   ├── UsersPage.js
│       │   ├── CategoriesPage.js
│       │   ├── ProductsPage.js
│       │   ├── StockInPage.js
│       │   ├── StockOutPage.js
│       │   ├── TransactionsPage.js
│       │   └── ReportsPage.js
│       │
│       ├── routes/                 ← Route protection components
│       │   ├── ProtectedRoute.js   ← Requires login
│       │   └── RoleBasedRoute.js   ← Requires specific role
│       │
│       ├── utils/                  ← Helper utilities
│       │   ├── auth.js             ← Token/session management
│       │   └── roles.js            ← Role constants
│       │
│       └── styles/                 ← CSS stylesheets
│           ├── layout.css          ← Sidebar & layout styles
│           └── login.css           ← Login page styles
│
└── documentation/                  ← This documentation folder
```
