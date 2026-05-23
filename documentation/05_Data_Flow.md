# Chapter 5: Data Flow — How Features Work End-to-End

This chapter walks through complete user stories from the moment a user clicks a button to the moment data appears on screen. Each flow traces the journey through every layer of the system.

---

## 5.1 Login Flow

**User Story:** "As a user, I want to log in with my username and password."

### Step-by-Step Journey

```
STEP 1 — User types "admin" / "admin123" and clicks Login
         ↓
STEP 2 — LoginPage.handleSubmit() runs
         • Calls validateForm() — checks both fields are filled
         • Sets loading to true (button shows "Signing in...")
         ↓
STEP 3 — loginUser(formData) is called
         [File: api/authService.js]
         • This calls axiosClient.post("/auth/login", { username, password })
         ↓
STEP 4 — axiosClient request interceptor runs
         [File: api/axiosClient.js]
         • Checks localStorage for a token (none exists yet — first login)
         • Sends the POST request to the backend
         ↓
STEP 5 — Express receives POST /api/auth/login
         [File: backend/app.js]
         • Matches to authRoutes → login controller
         • NO middleware required (login is public)
         ↓
STEP 6 — authController.login() runs
         [File: backend/controllers/authController.js]
         • Extracts { username, password } from req.body
         • Queries MongoDB: User.findOne({ username: "admin", status: "Active" })
         • Finds the admin user document
         • Runs bcrypt.compare("admin123", "$2a$10$hashedVersion...")
         • Password matches! ✓
         • Generates JWT token: jwt.sign({ id: "664a..." }, JWT_SECRET, { expiresIn: "1d" })
         • Returns: { token: "eyJ...", user: { id, fullName, username, role, status } }
         ↓
STEP 7 — Response travels back to the frontend
         • axiosClient receives the response
         • loginUser() returns data to LoginPage
         ↓
STEP 8 — LoginPage saves the session
         • saveSession({ token, user }) stores both in localStorage
         • navigate("/dashboard") redirects to the Dashboard
         ↓
STEP 9 — ProtectedRoute checks the session
         • isLoggedIn() returns true (ims_user exists in localStorage)
         • Dashboard page renders inside MainLayout
```

### What If Login Fails?

If the username doesn't exist or the password is wrong:
- Backend returns `401 { message: "Invalid username or password." }`
- axiosClient response interceptor catches the error
- LoginPage's catch block extracts the message
- `setError()` displays the red error banner above the form

---

## 5.2 Creating a New Product

**User Story:** "As an admin, I want to add a new product called 'Whiteboard Marker' to the system."

### Step-by-Step Journey

```
STEP 1 — Admin fills out the product form:
         Product Code: "P-003"
         Product Name: "Whiteboard Marker"
         Category: "Office Supplies" (selected from dropdown)
         Unit of Measure: "Piece"
         Quantity: 50
         Reorder Level: 10
         Price: 35
         ↓
STEP 2 — Admin clicks "Add Product"
         ProductsPage.handleSubmit() runs
         ↓
STEP 3 — Frontend validation
         • Checks: productCode? ✓  productName? ✓  categoryId? ✓
         • Converts numeric fields: Number("50") → 50
         ↓
STEP 4 — createProduct(cleanedForm) is called
         [File: api/productsApi.js]
         • Sends POST /api/products with the form data
         ↓
STEP 5 — axiosClient interceptor attaches JWT token
         • Authorization: Bearer eyJ...
         ↓
STEP 6 — Express receives POST /api/products
         • Route: router.post("/", protect, adminOnly, createProduct)
         • protect middleware → verifies JWT → attaches req.user ✓
         • adminOnly middleware → checks req.user.role === "Administrator" ✓
         ↓
STEP 7 — productController.createProduct() runs
         • Validates all required fields are present ✓
         • Checks Product.findOne({ productCode: "P-003" }) → not found ✓
         • Checks Category.findById(categoryId) → found ✓
         • Checks all numbers ≥ 0 ✓
         • Creates: Product.create({ productCode: "P-003", ... })
         • MongoDB assigns an _id and sets timestamps
         • Returns 201 with the new product document
         ↓
STEP 8 — Frontend receives success response
         • setSuccess("Product created successfully.")
         • Form is cleared (all fields reset to empty/0)
         • loadData() is called to refresh both products and categories
         • The table now shows the new product
```

---

## 5.3 Stock-Out Flow

**User Story:** "As a staff member, I want to record that 5 units of Bond Paper were taken from the warehouse."

### Step-by-Step Journey

```
STEP 1 — Staff navigates to Stock-Out page
         • useEffect triggers loadProducts()
         • GET /api/products returns all active products
         • Product dropdown is populated
         ↓
STEP 2 — Staff selects "P-001 - Bond Paper" from dropdown
         • form.productId is set to the product's _id
         • React recalculates: selectedProduct = products.find(...)
         • "Available Stock: 10" is displayed
         ↓
STEP 3 — Staff enters quantity: 5 and remarks: "For meeting room"
         ↓
STEP 4 — Staff clicks "Record Stock-Out"
         • validateForm() runs:
           - productId? ✓
           - quantity > 0? ✓
           - quantity (5) <= availableQuantity (10)? ✓
         ↓
STEP 5 — recordStockOut({ productId, quantity: 5, remarks }) is called
         • POST /api/stock/out
         • JWT token attached automatically
         ↓
STEP 6 — protect middleware verifies the token ✓
         (No adminOnly — all logged-in users can stock-out)
         ↓
STEP 7 — stockController.stockOut() runs
         • Finds the product: Product.findById(productId)
         • Confirms product exists and status is "Active" ✓
         • Checks: quantity (5) > quantityInStock (10)? No ✓
         • Calculates:
           previousQuantity = 10
           newQuantity = 10 - 5 = 5
         • Updates product: product.quantityInStock = 5; product.save()
         • Creates transaction: StockTransaction.create({
             productId, transactionType: "Stock Out", quantity: 5,
             previousQuantity: 10, newQuantity: 5,
             processedBy: req.user._id, remarks: "For meeting room"
           })
         • Returns 201 success
         ↓
STEP 8 — Frontend receives success
         • "Stock-out transaction recorded successfully." shown in green
         • Form is cleared
         • loadProducts() refreshes the product list
         • If the staff selects the same product again, it now shows "Available Stock: 5"
```

### What If There's Not Enough Stock?

If the staff tries to remove 15 units but only 10 are available:
- Frontend validates first: "Stock-out quantity cannot exceed available stock." (red error)
- Even if someone bypasses the frontend, the backend also checks and returns 400.

---

## 5.4 Viewing the Low Stock Report

**User Story:** "As a manager, I want to see which products are running low."

### Step-by-Step Journey

```
STEP 1 — User navigates to Reports page
         • Default activeReport is "inventory"
         • useEffect triggers API call to GET /api/reports/inventory
         ↓
STEP 2 — User clicks "Low Stock" button
         • setActiveReport("low-stock")
         • useEffect detects the change and calls getLowStockReport()
         • GET /api/reports/low-stock
         ↓
STEP 3 — Backend processes the request
         • reportController.getLowStockReport() runs
         • MongoDB query:
           Product.find({
             status: "Active",
             $expr: { $lte: ["$quantityInStock", "$reorderLevel"] }
           })
         • This finds products where the current stock is at or below
           the reorder threshold
         • Example: Bond Paper (qty: 5, reorder: 5) → INCLUDED
         • Example: Alcohol (qty: 8, reorder: 3) → NOT INCLUDED
         ↓
STEP 4 — Frontend receives the data
         • setRows(response.data.data)
         • isProductReport = true (since activeReport is "low-stock")
         • Table renders with columns: Code, Product, Category, Qty, Reorder, Status
         • Status column shows "Low Stock" for all items (by definition)
```

---

## 5.5 Deactivating and Reactivating a User

**User Story:** "As an admin, I want to disable a staff account and later re-enable it."

### Deactivation Flow
```
STEP 1 — Admin clicks "Deactivate" next to a Staff user
         • window.confirm() shows "Are you sure you want to deactivate this user?"
         • Admin clicks OK
         ↓
STEP 2 — deactivateUser(userId) is called
         • PATCH /api/users/{id}/deactivate
         ↓
STEP 3 — Backend sets user.status = "Inactive" and saves
         ↓
STEP 4 — User table refreshes
         • The StatusBadge now shows a red "Inactive" badge
         • The "Deactivate" button is replaced by an "Activate" button
         ↓
RESULT — That user can no longer log in because:
         • authController.login() searches for status: "Active" only
         • authMiddleware.protect() also checks status !== "Active"
```

### Reactivation Flow
```
STEP 1 — Admin clicks "Activate" next to the inactive user
         • window.confirm() shows "Are you sure you want to activate this user?"
         ↓
STEP 2 — updateUser(id, { status: "Active" }) is called
         • PUT /api/users/{id} with body { status: "Active" }
         ↓
STEP 3 — Backend updates user.status = "Active" and saves
         ↓
STEP 4 — User table refreshes
         • StatusBadge shows green "Active"
         • "Activate" button changes back to "Deactivate"
         ↓
RESULT — That user can now log in again
```

---

## 5.6 Editing a Category

**User Story:** "As an admin, I want to rename 'Office Supplies' to 'Office Equipment'."

```
STEP 1 — Admin clicks "Edit" next to "Office Supplies"
         • handleEdit(category) runs
         • editingId is set to the category's _id
         • Form is populated: categoryName = "Office Supplies", description = "..."
         • Blue "Editing Mode: Office Supplies" banner appears
         • Submit button text changes to "Update Category"
         ↓
STEP 2 — Admin changes the name to "Office Equipment" and clicks "Update Category"
         • handleSubmit() detects editingId is set
         • Calls updateCategory(editingId, form)
         • PUT /api/categories/{id}
         ↓
STEP 3 — Backend updates and responds
         • categoryController.updateCategory() finds the category
         • Updates only the fields that were provided
         • Returns the updated category
         ↓
STEP 4 — Frontend updates
         • "Category updated successfully." shown in green
         • editingId is cleared, form is emptied
         • Editing banner disappears
         • Button text returns to "Add Category"
         • Category table shows "Office Equipment"
```

---

## 5.7 Dashboard Data Loading

**What happens when the Dashboard page loads:**

```
useEffect(() => {
  loadStats();
}, []);

// Inside loadStats():
const [productsRes, categoriesRes, transactionsRes] = await Promise.all([
  getProducts(),       // GET /api/products
  getCategories(),     // GET /api/categories
  getTransactions()    // GET /api/stock/transactions
]);
```

**Promise.all** sends all three requests **simultaneously** (in parallel), not one after another. This makes the dashboard load faster because it doesn't wait for each request to finish before starting the next.

**Low stock calculation:**
```javascript
const lowStockCount = products.filter(
  p => Number(p.quantityInStock) <= Number(p.reorderLevel)
).length;
```
This counts how many products have stock at or below their reorder level.
