# Inventory Management System — Technical Documentation

## Table of Contents

Welcome to the complete technical documentation of the Inventory Management System (IMS). This guide is written for capstone documentation purposes and is designed to be beginner-friendly while remaining technically accurate and comprehensive.

Each chapter builds on the previous one, starting from a bird's-eye view and progressively going deeper into the implementation.

---

### [Chapter 1: System Overview](./01_System_Overview.md)
**Start here.** Understand what the system is, who uses it, what technologies it's built with, and how all the pieces connect. Includes the full project folder structure and a high-level architecture diagram.

**Topics covered:**
- What the system is and what problem it solves
- User roles (Administrator vs Staff)
- Complete technology stack (React, Express, MongoDB, and more)
- High-level architecture diagram
- Detailed project folder structure

---

### [Chapter 2: Database Design](./02_Database_Design.md)
**Understand the data.** Learn about each collection (table) in MongoDB, every field and its purpose, and how collections relate to each other.

**Topics covered:**
- What MongoDB is and why it's used
- The 4 Mongoose Models: User, Category, Product, StockTransaction
- Field-by-field schema breakdown with types, constraints, and defaults
- Entity Relationship Diagram (ERD)
- Foreign key references and how `.populate()` works
- Database connection configuration

---

### [Chapter 3: Backend Architecture](./03_Backend_Architecture.md)
**Understand the server.** Learn how the Express backend starts, how requests flow through middleware, and what every controller function does.

**Topics covered:**
- How `app.js` boots the server step-by-step
- The complete request-response flow diagram
- Authentication middleware (`protect`) and authorization middleware (`adminOnly`)
- All 6 controllers with every function explained
- Complete API endpoint reference table (17 endpoints)
- Environment variables
- Seed scripts for initial data

---

### [Chapter 4: Frontend Architecture](./04_Frontend_Architecture.md)
**Understand the user interface.** Learn how React renders pages, how routes are protected, how the sidebar works, and how every page component is built.

**Topics covered:**
- React SPA concept and how routing works
- Route protection (ProtectedRoute, RoleBasedRoute)
- Layout system (MainLayout, Sidebar)
- The Axios API communication layer with interceptors
- Session management with localStorage
- All 9 reusable components explained
- Page-by-page walkthrough (Login through Reports)
- CSS architecture overview

---

### [Chapter 5: Data Flow — How Features Work End-to-End](./05_Data_Flow.md)
**See it in action.** Complete user stories traced from button click → frontend → API → middleware → controller → database → response → UI update.

**Flows documented:**
1. Login flow (with failure scenario)
2. Creating a new product (admin)
3. Stock-out transaction (with insufficient stock scenario)
4. Viewing the low stock report
5. Deactivating and reactivating a user
6. Editing a category
7. Dashboard data loading with parallel requests

---

### [Chapter 6: Security, Validations & Deployment](./06_Security_Validation_Deployment.md)
**Understand the guardrails.** Learn about password hashing, JWT tokens, CORS, input validation, and how the system is deployed to the cloud.

**Topics covered:**
- Password hashing with bcryptjs
- JWT authentication flow
- CORS configuration
- Complete validation reference table (20+ rules)
- Frontend vs backend validation philosophy
- Deployment architecture diagram (Vercel + MongoDB Atlas)
- Production URLs
- Development commands
- Swagger API documentation
- Utility files

---

## Quick Facts

| Item | Detail |
|------|--------|
| **Frontend Framework** | React 19.2.5 |
| **Backend Framework** | Express 5.2.1 |
| **Database** | MongoDB Atlas (Mongoose 9.6.2) |
| **Authentication** | JWT (jsonwebtoken 9.0.3) + bcryptjs |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Vercel (Serverless Functions) |
| **API Documentation** | Swagger UI (OpenAPI 3.0) |
| **Total API Endpoints** | 17 |
| **Database Collections** | 4 (users, categories, products, stocktransactions) |
| **Frontend Pages** | 9 |
| **Reusable Components** | 9 |
| **User Roles** | 2 (Administrator, Staff) |

---

*Documentation generated from direct codebase inspection. All explanations are based on the actual implementation, not assumptions.*
