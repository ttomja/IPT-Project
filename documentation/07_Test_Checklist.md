# Chapter 7: Comprehensive Test Checklist

This document provides a complete list of manual test cases you should perform to verify every feature of the Inventory Management System. Each test case tells you **what to do**, **what you should see**, and **whether it passed or failed**.

> **How to use this document:** Go through each test case in order. Mark the Result column with ✅ (Pass) or ❌ (Fail). If a test fails, write what actually happened in the Notes column.

---

## Test Environment

| Item | Value |
|------|-------|
| **Frontend URL** | https://ipt-project-ims-fe.vercel.app |
| **Backend Health** | https://ipt-project-backend-vercel.vercel.app/api/health |
| **API Docs** | https://ipt-project-backend-vercel.vercel.app/api/docs |
| **Admin Credentials** | Username: `admin` / Password: `admin123` |
| **Staff Credentials** | Username: `staff` / Password: `staff123` |
| **Browser Used** | _(fill in: Chrome, Firefox, Edge, etc.)_ |
| **Date Tested** | _(fill in)_ |
| **Tester Name** | _(fill in)_ |

---

## Module 1: System Health & API Documentation

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 1.1 | API Health Check | Visit `/api/health` in browser | JSON response with `"message": "Inventory Management System API is running"` and `"databaseStatus": "Connected"` | | |
| 1.2 | Swagger Docs Load | Visit `/api/docs` in browser | Swagger UI page loads with all endpoint groups visible | | |
| 1.3 | Swagger Authorize Button | Click the green "Authorize" button on Swagger page | A dialog appears asking for a Bearer token | | |

---

## Module 2: Authentication (Login / Logout)

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 2.1 | Login page loads | Navigate to `/login` | Login form displayed with title "Inventory Management System", username/password fields, and credential note | | |
| 2.2 | Empty username login | Leave username empty, type any password, click Login | Error: "Username is required." | | |
| 2.3 | Empty password login | Type any username, leave password empty, click Login | Error: "Password is required." | | |
| 2.4 | Wrong credentials | Enter `admin` / `wrongpassword`, click Login | Error: "Invalid username or password." | | |
| 2.5 | Non-existent user | Enter `fakeuser` / `fakepass`, click Login | Error: "Invalid username or password." | | |
| 2.6 | Admin login success | Enter `admin` / `admin123`, click Login | Redirected to `/dashboard`. Sidebar shows "System Administrator" with role "Administrator" | | |
| 2.7 | Staff login success | Log out first, then enter `staff` / `staff123`, click Login | Redirected to `/dashboard`. Sidebar shows staff name with role "Staff" | | |
| 2.8 | Loading state on login | Enter valid credentials, click Login | Button text changes to "Signing in..." and is disabled during the request | | |
| 2.9 | Logout | Click the "Logout" button at bottom of sidebar | Redirected to `/login`. Session is cleared. | | |
| 2.10 | Session persistence | Log in, close the browser tab, reopen the URL `/dashboard` | Dashboard loads without needing to log in again (session stored in localStorage) | | |
| 2.11 | Protected route redirect | Log out. Try visiting `/dashboard` directly in the URL bar | Redirected to `/login` | | |
| 2.12 | Protected route redirect (products) | Log out. Try visiting `/products` directly | Redirected to `/login` | | |

---

## Module 3: Dashboard

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 3.1 | Dashboard loads | Log in and verify dashboard | Four cards visible: Products, Categories, Low Stock, Transactions — each with a numeric value | | |
| 3.2 | Products count accuracy | Compare the "Products" card value with the count on the Products page | Numbers match | | |
| 3.3 | Categories count accuracy | Compare the "Categories" card value with the count on the Categories page | Numbers match | | |
| 3.4 | Low Stock count accuracy | Compare the "Low Stock" card value with products where Qty ≤ Reorder Level on the Products page | Numbers match | | |
| 3.5 | Transactions count accuracy | Compare the "Transactions" card value with the total rows on the Transactions page | Numbers match | | |
| 3.6 | Card hover effect | Hover over any dashboard card | Card slightly lifts up with a shadow effect | | |

---

## Module 4: User Management (Admin Only)

> **Prerequisite:** Log in as `admin`.

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 4.1 | Users page loads | Click "Users" in sidebar | User Management page loads with form and user table | | |
| 4.2 | Users link hidden for Staff | Log in as `staff` | "Users" link is NOT visible in the sidebar | | |
| 4.3 | Staff cannot access /users URL | Log in as `staff`, manually type `/users` in URL bar | Redirected to `/dashboard` (blocked by RoleBasedRoute) | | |
| 4.4 | Create user — empty fields | Leave Full Name and Username empty, click "Add User" | Error: "Full name and username are required." | | |
| 4.5 | Create user — success | Fill in: Full Name = "Test User", Username = "testuser", Password = "test123", Role = "Staff". Click "Add User" | Success: "User created successfully." New user appears in table with "Active" badge. | | |
| 4.6 | Create user — duplicate username | Try creating another user with Username = "testuser" | Error: "Username already exists." | | |
| 4.7 | Edit user | Click "Edit" on the test user | Form populates with user's current data. Blue "Editing Mode" banner appears. Button text changes to "Update User". | | |
| 4.8 | Cancel edit | Click "Cancel" on the editing banner | Form clears. Banner disappears. Button text returns to "Add User". | | |
| 4.9 | Update user | Click Edit, change Full Name to "Updated User", click "Update User" | Success: "User updated successfully." Table shows updated name. | | |
| 4.10 | Deactivate user | Click "Deactivate" on the test user | Confirmation dialog appears. Click OK. User status changes to "Inactive" (red badge). Button changes to "Activate". | | |
| 4.11 | Deactivated user cannot login | Log out. Try logging in as the deactivated user | Error: "Invalid username or password." | | |
| 4.12 | Activate user | Log back in as admin. Click "Activate" on the inactive user | Confirmation dialog appears. Click OK. Status changes back to "Active" (green badge). | | |
| 4.13 | Reactivated user can login | Log out. Log in as the reactivated user | Login succeeds. Dashboard loads. | | |
| 4.14 | Cancel deactivation | Click "Deactivate" on a user, then click "Cancel" on the dialog | Nothing happens. User remains Active. | | |

---

## Module 5: Category Management (Admin Only)

> **Prerequisite:** Log in as `admin`.

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 5.1 | Categories page loads | Click "Categories" in sidebar | Category Management page loads with form and category table | | |
| 5.2 | Categories hidden for Staff | Log in as `staff` | "Categories" link is NOT visible in the sidebar | | |
| 5.3 | Create category — empty name | Leave Category Name empty, click "Add Category" | Error: "Category name is required." | | |
| 5.4 | Create category — success | Enter: Category Name = "Test Category", Description = "For testing". Click "Add Category" | Success: "Category created successfully." Category appears in table. | | |
| 5.5 | Create category — duplicate | Try creating another category with the same name | Error: "Category already exists." | | |
| 5.6 | Edit category | Click "Edit" on a category | Form populates. Blue "Editing Mode" banner shows category name. Button says "Update Category". | | |
| 5.7 | Update category | Change the name, click "Update Category" | Success: "Category updated successfully." Table shows new name. | | |
| 5.8 | Cancel edit | Click "Cancel" on the editing banner | Form clears. Banner disappears. | | |

---

## Module 6: Product Management

> **Prerequisite:** Log in as `admin` for create/edit tests. Log in as `staff` for view-only tests.

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 6.1 | Products page loads (admin) | Click "Products" in sidebar as admin | Form + search bar + filter dropdown + product table visible | | |
| 6.2 | Products page loads (staff) | Click "Products" in sidebar as staff | NO form visible. Only search bar, filter, and table visible. No Edit/Deactivate buttons on rows. | | |
| 6.3 | Create product — missing fields | Leave required fields empty, click "Add Product" | Error: "Product code, product name, and category are required." | | |
| 6.4 | Create product — success | Fill all fields: Code = "P-TEST", Name = "Test Product", Category = (select any), Unit = "Piece", Qty = 20, Reorder = 5, Price = 100. Click "Add Product". | Success: "Product created successfully." Product appears in table. | | |
| 6.5 | Create product — duplicate code | Try creating another product with Code = "P-TEST" | Error: "Product code already exists." | | |
| 6.6 | Search by name | Type "Test" in the search bar | Only products containing "Test" in their name or code are shown | | |
| 6.7 | Search by code | Type "P-TEST" in the search bar | The test product appears | | |
| 6.8 | Clear search | Delete all text from search bar | All products are shown again | | |
| 6.9 | Filter by category | Select a specific category from the dropdown | Only products in that category are shown | | |
| 6.10 | Filter "All Categories" | Select "All Categories" from dropdown | All products are shown | | |
| 6.11 | Search + filter combined | Type a search term AND select a category | Only products matching BOTH criteria are shown | | |
| 6.12 | Edit product | Click "Edit" on a product | Form populates with all product data. Editing banner appears. | | |
| 6.13 | Update product | Change the product name, click "Update Product" | Success: "Product updated successfully." Table reflects the change. | | |
| 6.14 | Deactivate product | Click "Deactivate" on an active product | Confirmation dialog. Product disappears from the active list (only active products are shown). | | |
| 6.15 | Low Stock indicator | Find or create a product where Qty ≤ Reorder Level | "Stock Note" column shows a yellow "Low Stock" badge | | |
| 6.16 | Normal stock indicator | Find a product where Qty > Reorder Level | "Stock Note" column shows "Normal" | | |
| 6.17 | Description tooltip | Hover over a product name that has a description | A tooltip appears showing the description text | | |
| 6.18 | Negative number rejection | Try entering -5 in the Quantity field | Backend returns error: "Numeric values cannot be negative." | | |

---

## Module 7: Stock-In

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 7.1 | Stock-In page loads | Click "Stock-In" in sidebar | Form with Product dropdown, Quantity input, and Remarks field | | |
| 7.2 | Product dropdown populated | Click the Product dropdown | All active products listed as "Code - Name" format | | |
| 7.3 | Stock-In — no product selected | Leave product unselected, enter quantity, click "Record Stock-In" | Error: "Please select a product." | | |
| 7.4 | Stock-In — zero quantity | Select a product, enter 0, click submit | Error: "Quantity must be greater than 0." | | |
| 7.5 | Stock-In — negative quantity | Select a product, enter -5 | Error: "Quantity must be greater than 0." | | |
| 7.6 | Stock-In — success | Select a product (note current stock), enter Qty = 10, Remarks = "Delivery". Click "Record Stock-In". | Success: "Stock-in transaction recorded successfully." Form clears. | | |
| 7.7 | Stock-In — verify stock updated | Go to Products page, find the product | Quantity should be previous value + 10 | | |
| 7.8 | Stock-In — verify transaction logged | Go to Transactions page | New "Stock In" row appears at top with correct product, qty, previous, new, and your username | | |
| 7.9 | Saving state | Click "Record Stock-In" | Button shows "Saving..." and is disabled during the API call | | |

---

## Module 8: Stock-Out

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 8.1 | Stock-Out page loads | Click "Stock-Out" in sidebar | Form with Product dropdown, Available Stock display, Quantity input, and Remarks | | |
| 8.2 | Available stock display | Select a product from the dropdown | "Available Stock: X" shows the correct current quantity | | |
| 8.3 | Stock-Out — exceeds available | Select a product with 10 in stock, enter Qty = 15 | Error: "Stock-out quantity cannot exceed available stock." | | |
| 8.4 | Stock-Out — success | Select a product with 10 in stock, enter Qty = 3, Remarks = "Department use". Click "Record Stock-Out". | Success: "Stock-out transaction recorded successfully." | | |
| 8.5 | Stock-Out — verify stock updated | Go to Products page, find the product | Quantity should be previous value - 3 | | |
| 8.6 | Stock-Out — verify transaction logged | Go to Transactions page | New "Stock Out" row at top with correct data | | |
| 8.7 | Stock-Out — zero out a product | Remove all remaining stock from a product | Success. Product shows 0 quantity. | | |
| 8.8 | Stock-Out — from zero stock | Try to stock-out from a product with 0 quantity | Error: "Stock-out quantity cannot exceed available stock." | | |

---

## Module 9: Transaction History

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 9.1 | Transactions page loads | Click "Transactions" in sidebar | Table with all transactions, sorted by most recent first | | |
| 9.2 | Filter — All | Select "All Transactions" | All stock-in and stock-out transactions shown | | |
| 9.3 | Filter — Stock In only | Select "Stock In" | Only stock-in transactions shown | | |
| 9.4 | Filter — Stock Out only | Select "Stock Out" | Only stock-out transactions shown | | |
| 9.5 | Date format | Check the Date column | Dates displayed in a readable local format | | |
| 9.6 | Processed By column | Check who performed each transaction | Shows the full name of the user who did the stock-in/out | | |
| 9.7 | Empty state | (If no transactions exist) | "No transactions found." message displayed | | |

---

## Module 10: Reports

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 10.1 | Reports page loads | Click "Reports" in sidebar | Page loads with 4 report buttons and a table | | |
| 10.2 | Current Inventory report | Click "Current Inventory" | Table shows: Code, Product, Category, Qty, Reorder, Status for all active products | | |
| 10.3 | Low Stock report | Click "Low Stock" | Only products where Qty ≤ Reorder Level are shown. Status column shows "Low Stock" for all. | | |
| 10.4 | Low Stock — no items | (If all products have sufficient stock) | "No records found for this report." | | |
| 10.5 | Stock-In report | Click "Stock-In" | Table shows: Date, Product, Type (all "Stock In"), Qty, Previous, New | | |
| 10.6 | Stock-Out report | Click "Stock-Out" | Table shows: Date, Product, Type (all "Stock Out"), Qty, Previous, New | | |
| 10.7 | Report switching | Click between different report buttons rapidly | Table updates correctly each time without errors | | |
| 10.8 | Loading state | Click a report button | "Loading report..." message appears briefly | | |

---

## Module 11: Sidebar Navigation & Layout

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 11.1 | Sidebar brand | Check sidebar top | "IMS" brand text with box icon visible | | |
| 11.2 | User profile display | Check sidebar profile area | Shows logged-in user's full name, role, and first-letter avatar | | |
| 11.3 | Active page highlight | Click "Products" | The Products link in the sidebar is highlighted (white background) | | |
| 11.4 | Navigation changes highlight | Click "Dashboard", then "Transactions" | Highlight moves from Dashboard to Transactions | | |
| 11.5 | Admin sidebar links | Log in as admin | All links visible: Dashboard, Users, Categories, Products, Stock-In, Stock-Out, Transactions, Reports | | |
| 11.6 | Staff sidebar links | Log in as staff | Only these visible: Dashboard, Products, Stock-In, Stock-Out, Transactions, Reports. Users and Categories are hidden. | | |
| 11.7 | Logout hover effect | Hover over the Logout button | Button turns reddish with a color change | | |
| 11.8 | Section labels | Check the sidebar | "Main", "Management" (admin only), "Inventory", "Records" section labels visible in uppercase | | |

---

## Module 12: Error Handling & Edge Cases

| # | Test Case | Steps | Expected Result | Result | Notes |
|---|-----------|-------|----------------|--------|-------|
| 12.1 | Invalid URL | Visit `/nonexistent-page` | Blank page or redirect (no crash) | | |
| 12.2 | Network error | Disconnect internet, try to load Products page | Error message displayed (timeout after 10 seconds) | | |
| 12.3 | Expired token | Wait 24+ hours without refreshing, then try an action | Should get 401 error; ideally should redirect to login | | |
| 12.4 | Backend down | If backend is not running, try to log in | Error message displayed (not a blank screen) | | |
| 12.5 | Double-click submit | Rapidly double-click "Add Product" | Should not create duplicate products (button is disabled during save) | | |
| 12.6 | Special characters in input | Create a product with name: `Test <script>alert('xss')</script>` | Characters stored literally, no script execution | | |
| 12.7 | Very long input | Enter a 500-character product name | Should be accepted and displayed (may overflow visually but no crash) | | |

---

## Test Summary Report

| Module | Total Tests | Passed | Failed | Notes |
|--------|-----------|--------|--------|-------|
| 1. System Health | 3 | | | |
| 2. Authentication | 12 | | | |
| 3. Dashboard | 6 | | | |
| 4. User Management | 14 | | | |
| 5. Category Management | 8 | | | |
| 6. Product Management | 18 | | | |
| 7. Stock-In | 9 | | | |
| 8. Stock-Out | 8 | | | |
| 9. Transaction History | 7 | | | |
| 10. Reports | 8 | | | |
| 11. Sidebar & Layout | 8 | | | |
| 12. Error Handling | 7 | | | |
| **TOTAL** | **108** | | | |

---

### Testing Tips

1. **Test in order** — Modules build on each other. Create test data in Module 4–6 that you'll use in Module 7–10.
2. **Test as both roles** — Many features behave differently for Admin vs Staff. Switch between accounts.
3. **Check the database** — After critical operations (create, stock-in, stock-out), you can verify the data in MongoDB Atlas directly.
4. **Clear localStorage** — If you get stuck in a weird state, open browser DevTools → Application → Local Storage → clear `ims_token` and `ims_user`.
5. **Screenshot failures** — If a test fails, take a screenshot for your documentation.
