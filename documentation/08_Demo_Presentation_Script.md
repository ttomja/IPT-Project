# Chapter 8: Demo Presentation Script

## Presentation Overview

| Item | Detail |
|------|--------|
| **Duration** | 5–7 minutes |
| **Presenters** | 3 people |
| **System** | Inventory Management System (IMS) |
| **Live URL** | https://ipt-project-ims-fe.vercel.app/login |
| **Format** | Live demo with narration |

---

## Role Assignments

| Role | Name _(fill in)_ | Responsibility |
|------|------------------|----------------|
| **Presenter 1** | _____________ | Introduction + System Overview + Login + Dashboard |
| **Presenter 2** | _____________ | Admin Features: Users, Categories, Products |
| **Presenter 3** | _____________ | Operations: Stock-In, Stock-Out, Transactions, Reports + Closing |

---

## Pre-Demo Checklist

Before presenting, make sure:
- [ ] The live site is accessible (visit https://ipt-project-ims-fe.vercel.app/login)
- [ ] The backend is running (visit https://ipt-project-backend-vercel.vercel.app/api/health — should show "Connected")
- [ ] You have the credentials ready: `admin` / `admin123` and `staff` / `staff123`
- [ ] Your browser is full-screen with no personal bookmarks or tabs visible
- [ ] You have a stable internet connection
- [ ] Have some existing data in the system (products, categories, transactions) so tables aren't empty

> **Tip:** Visit the backend health URL before presenting to trigger the first serverless function call and avoid a tiny cold-start delay.

---

## The Script

---

### 🎤 PRESENTER 1 — Introduction & Dashboard (2 minutes)

---

**[SLIDE or STAND — No screen yet]**

> *"Good [morning/afternoon], everyone. We are [names], and today we are presenting our **Inventory Management System** — a full-stack web application built for tracking products, managing stock movements, and generating inventory reports."*

> *"The system was built using **React** for the frontend, **Express.js with Node.js** for the backend API, and **MongoDB Atlas** as our cloud database. Both the frontend and backend are deployed on **Vercel**, making it fully serverless and accessible online."*

> *"There are two user roles in the system: **Administrator**, who has full access to manage users, categories, and products — and **Staff**, who can view products and record stock transactions. Let me walk you through it."*

**[OPEN THE BROWSER — Show the Login Page]**

> *"This is our login page. The system uses **JWT authentication** — when a user logs in, the backend verifies their credentials, hashes the password check using **bcrypt**, and returns a secure token that is stored in the browser. Every future request to the server includes this token for verification."*

**[TYPE: admin / admin123 → CLICK LOGIN]**

> *"I'm now logging in as the System Administrator."*

**[DASHBOARD LOADS — Pause to let the panel see it]**

> *"This is the **Dashboard**. It gives us a quick snapshot of the system: the total number of active **products**, **categories**, products that are at **low stock**, and the total number of **stock transactions** recorded. These values are fetched live from the database each time the page loads."*

> *"On the left, you can see our **sidebar navigation** — it shows the user's name and role, and organizes the pages into sections: Main, Management, Inventory, and Records. Now I'll hand it over to [Presenter 2] to demonstrate the admin management features."*

---

### 🎤 PRESENTER 2 — Admin Features (2–2.5 minutes)

---

**[CLICK: Users in sidebar]**

> *"Thank you. This is the **User Management** page — accessible only to Administrators. Staff users cannot see this link in the sidebar, and even if they try to access the URL directly, our **role-based route protection** will redirect them to the dashboard."*

> *"Here we can see the user table with each user's full name, username, role, and status. Let me quickly create a new user."*

**[FILL FORM: Full Name = "Demo Staff", Username = "demo", Password = "demo123", Role = Staff → CLICK "Add User"]**

> *"The user was created successfully. The password is **hashed using bcrypt** before being stored — so it's never saved as plain text in the database. Notice the green 'Active' status badge."*

> *"We can also **deactivate** a user, which prevents them from logging in without permanently deleting their record."*

**[CLICK: Deactivate on the new user → Confirm]**

> *"The status changed to 'Inactive.' If this user tries to log in now, the system will reject them. We can also **reactivate** them at any time by clicking 'Activate.'"*

**[CLICK: Categories in sidebar]**

> *"Moving on to **Category Management**. Categories group products — for example, 'Office Supplies' or 'Cleaning Supplies.' Let me create a new one."*

**[FILL: Category Name = "Electronics", Description = "Electronic devices and accessories" → CLICK "Add Category"]**

> *"Created. Now let's move to the most feature-rich page — **Product Management**."*

**[CLICK: Products in sidebar]**

> *"Here we can create, edit, search, filter, and deactivate products. Each product has a unique code, a name, belongs to a category, has a unit of measure, current stock quantity, a reorder level, and a price."*

> *"The reorder level is important — when the stock drops to or below this number, the system flags it as **'Low Stock'** with a yellow badge in the Stock Note column."*

**[POINT TO: the search bar and category filter]**

> *"We also have **real-time search** by product name or code, and a **category filter** dropdown. These two work together, so you can search within a specific category."*

> *"Now I'll hand it over to [Presenter 3] to show the stock operations and reporting."*

---

### 🎤 PRESENTER 3 — Operations & Closing (2–2.5 minutes)

---

**[CLICK: Stock-In in sidebar]**

> *"Thank you. Now let's look at the day-to-day operations. This is the **Stock-In** page, used to record incoming inventory. I'll select a product and add 10 units."*

**[SELECT: a product from dropdown → TYPE: Quantity = 10, Remarks = "New delivery" → CLICK "Record Stock-In"]**

> *"Done. The product's stock count is now increased by 10. Notice that the system records **who** performed this transaction, the **previous quantity**, the **new quantity**, and the **timestamp** — creating a full audit trail."*

**[CLICK: Stock-Out in sidebar]**

> *"This is the **Stock-Out** page. It works similarly, but with one key difference — when you select a product, it shows the **Available Stock** in real-time. And the system **validates** that you cannot remove more than what's available."*

**[SELECT: same product → SHOW available stock]**

> *"Let me remove 3 units."*

**[TYPE: Quantity = 3, Remarks = "Department request" → CLICK "Record Stock-Out"]**

> *"Recorded. Now let's see the full history."*

**[CLICK: Transactions in sidebar]**

> *"The **Transaction History** page shows every stock movement ever made. We can filter by type — All, Stock In, or Stock Out. Each row shows the date, product, type, quantity moved, previous and new stock levels, who processed it, and any remarks. This is the system's **complete audit log**."*

**[CLICK: Reports in sidebar]**

> *"Finally, the **Reports** page. We have four reports:"*

**[CLICK: "Current Inventory" button]**

> *"**Current Inventory** — shows all active products with their stock levels."*

**[CLICK: "Low Stock" button]**

> *"**Low Stock** — highlights products that need restocking, where the quantity is at or below the reorder level."*

**[CLICK: "Stock-In" button, then "Stock-Out" button]**

> *"And **Stock-In** and **Stock-Out** reports for transaction history filtered by type."*

**[STEP BACK or CLOSE BROWSER — Final remarks]**

> *"To summarize, our Inventory Management System provides:"*
>
> *"**Secure authentication** with JWT tokens and hashed passwords."*
>
> *"**Role-based access control** — Administrators manage the system, Staff handle daily operations."*
>
> *"**Complete inventory tracking** — from product creation, to stock-in/out, to reports."*
>
> *"**Full audit trail** — every stock movement is permanently recorded."*
>
> *"And it's **fully deployed** and accessible online."*
>
> *"Thank you. Are there any questions?"*

---

## Timing Guide

| Section | Presenter | Target Time | Running Total |
|---------|-----------|-------------|---------------|
| Introduction + Tech stack | P1 | 0:30 | 0:30 |
| Login + Auth explanation | P1 | 0:30 | 1:00 |
| Dashboard walkthrough | P1 | 0:30 | 1:30 |
| Handoff to P2 | — | 0:05 | 1:35 |
| User Management demo | P2 | 0:45 | 2:20 |
| Category Management demo | P2 | 0:25 | 2:45 |
| Product Management demo | P2 | 0:40 | 3:25 |
| Handoff to P3 | — | 0:05 | 3:30 |
| Stock-In demo | P3 | 0:30 | 4:00 |
| Stock-Out demo | P3 | 0:30 | 4:30 |
| Transactions page | P3 | 0:20 | 4:50 |
| Reports demo | P3 | 0:30 | 5:20 |
| Closing summary + Q&A | P3 | 0:40 | **6:00** |

---

## Emergency Backup Plan

If the live site is slow (Vercel serverless function could experience a tiny cold-start delay on the first request):

1. **Stall naturally:** Presenter 1 can extend the introduction while waiting.
2. **Show the health endpoint first** to verify the backend is awake before logging in.
3. **Have screenshots ready** as a fallback (capture each page beforehand).
4. **Run locally** if internet is a concern: Start `npm run dev` (backend) and `npm start` (frontend) before presenting.

---

## Anticipated Questions & Answers

| Question | Answer |
|----------|--------|
| "What database are you using?" | "MongoDB Atlas — a cloud-hosted NoSQL document database. We chose it because it works naturally with JavaScript objects and is free to host." |
| "How is the password stored?" | "It's hashed using bcryptjs with 10 salt rounds. The original password is never stored. During login, bcrypt compares the hashed version." |
| "What happens if a staff member tries to access admin pages?" | "The frontend hides the links, and our route protection components redirect them. Even if they bypass the frontend, the backend middleware returns a 403 Forbidden error." |
| "How do you track who did what?" | "Every stock transaction records the user who processed it via the `processedBy` field. This creates a complete audit trail." |
| "Is this deployed?" | "Yes. Both the frontend and backend are deployed on Vercel, and the database is hosted on MongoDB Atlas. It's fully live and accessible right now." |
| "What framework is the frontend?" | "React 19, using React Router for navigation and Axios for API calls." |
| "What framework is the backend?" | "Express.js 5 running on Node.js, with Mongoose as our MongoDB ODM." |
