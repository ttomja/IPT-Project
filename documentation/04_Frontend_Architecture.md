# Chapter 4: Frontend Architecture

## 4.1 How the Frontend Works

The frontend is a **React Single-Page Application (SPA)**. This means:

1. The browser downloads the entire application once.
2. When the user navigates between pages (e.g., Dashboard → Products), the browser does NOT reload. Instead, React dynamically swaps out the page component.
3. Data is fetched from the backend API using **Axios** (an HTTP client library).
4. The application state (data shown on screen) is managed using React's built-in `useState` and `useEffect` hooks.

---

## 4.2 Application Entry Point

### `src/index.js`
This is the very first file that runs. It tells React: "Render the `<App />` component inside the HTML element with id `root`."

### `src/App.js` — The Router
This is the **central hub** of the entire frontend. It defines every URL path and which page component to render:

```
URL Path          → Component          → Protection
/                 → Redirects to /login
/login            → LoginPage          → None (public)
/dashboard        → DashboardPage      → ProtectedRoute (must be logged in)
/users            → UsersPage          → RoleBasedRoute (admin only)
/categories       → CategoriesPage     → ProtectedRoute
/products         → ProductsPage       → ProtectedRoute
/stock-in         → StockInPage        → ProtectedRoute
/stock-out        → StockOutPage       → ProtectedRoute
/transactions     → TransactionsPage   → ProtectedRoute
/reports          → ReportsPage        → ProtectedRoute
```

Every page (except Login) is wrapped in `<MainLayout>`, which provides the sidebar navigation.

---

## 4.3 Route Protection System

### ProtectedRoute (`src/routes/ProtectedRoute.js`)

**What it does:** Checks if the user is logged in. If not, redirects to `/login`.

**How it works:**
1. Calls `isLoggedIn()` from `utils/auth.js`.
2. That function checks if `ims_user` exists in `localStorage`.
3. If yes → renders the child page component.
4. If no → renders `<Navigate to="/login" replace />`, which redirects the browser.

**Usage in App.js:**
```jsx
<ProtectedRoute>
  <MainLayout>
    <DashboardPage />
  </MainLayout>
</ProtectedRoute>
```

### RoleBasedRoute (`src/routes/RoleBasedRoute.js`)

**What it does:** Checks if the user has the required role. If not, redirects to `/dashboard`.

**How it works:**
1. Reads the user object from localStorage.
2. If the user is not logged in → redirects to `/login`.
3. If the user's role is not in the `allowedRoles` array → redirects to `/dashboard`.
4. Otherwise → renders the page.

**Usage in App.js (Users page is admin-only):**
```jsx
<RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
  <MainLayout>
    <UsersPage />
  </MainLayout>
</RoleBasedRoute>
```

---

## 4.4 Layout System

### MainLayout (`src/layouts/MainLayout.js`)

**What it does:** Wraps every page (except Login) in a consistent layout structure.

**Structure:**
```
┌─────────────────────────────────────────────────┐
│                  .app-layout                     │
│  ┌──────────┐  ┌──────────────────────────────┐ │
│  │          │  │         .main-content         │ │
│  │ Sidebar  │  │  ┌────────────────────────┐  │ │
│  │          │  │  │    .page-content        │  │ │
│  │          │  │  │                         │  │ │
│  │          │  │  │  (child page renders    │  │ │
│  │          │  │  │   here)                 │  │ │
│  │          │  │  │                         │  │ │
│  │          │  │  └────────────────────────┘  │ │
│  └──────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Sidebar (`src/layouts/Sidebar.js`)

**What it does:** Renders the left-side navigation panel.

**Key features:**
1. **Brand Section:** Displays the "IMS" logo and brand name.
2. **User Profile:** Shows the logged-in user's name, role, and avatar (first letter of their name).
3. **Navigation Links:** Organized into sections:
   - **Main:** Dashboard
   - **Management:** Users, Categories (visible only to Administrators)
   - **Inventory:** Products, Stock-In, Stock-Out
   - **Records:** Transactions, Reports
4. **Active State:** The current page's link is highlighted using the `.active` CSS class.
5. **Logout Button:** Clears the session from localStorage and redirects to `/login`.

**Role-based visibility:**
```javascript
const isAdmin = user?.role === "Administrator" || user?.role === "Admin";

{isAdmin && (
  <>
    <NavLink to="/users" icon={icons.users} label="Users" />
    <NavLink to="/categories" icon={icons.categories} label="Categories" />
  </>
)}
```
Staff users simply never see the Users and Categories links in the sidebar.

---

## 4.5 The API Communication Layer

### axiosClient (`src/api/axiosClient.js`)

This is the **single, centralized HTTP client** that every page uses to talk to the backend. It is configured once and reused everywhere.

**Configuration:**
```javascript
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,  // 10 seconds max per request
});
```

**Request Interceptor (runs before EVERY request):**
```javascript
axiosClient.interceptors.request.use((config) => {
  const token = getToken();  // Reads JWT from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
This automatically attaches the JWT token to every API call. The developer never has to manually add the token — it happens automatically.

**Response Interceptor (runs after EVERY response):**
```javascript
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong.";
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);
```
If any request fails, this extracts the error message from the backend response and attaches it as `friendlyMessage`, making it easy for page components to display user-friendly errors.

### API Service Files

Each feature has its own API file that exports simple functions:

**`productsApi.js`:**
```javascript
export const getProducts = (params) => axiosClient.get("/products", { params });
export const createProduct = (data) => axiosClient.post("/products", data);
export const updateProduct = (id, data) => axiosClient.put(`/products/${id}`, data);
export const deactivateProduct = (id) => axiosClient.patch(`/products/${id}/deactivate`);
```

**`categoriesApi.js`:**
```javascript
export const getCategories = () => axiosClient.get("/categories");
export const createCategory = (data) => axiosClient.post("/categories", data);
export const updateCategory = (id, data) => axiosClient.put(`/categories/${id}`, data);
```

**`usersApi.js`:**
```javascript
export const getUsers = () => axiosClient.get("/users");
export const createUser = (data) => axiosClient.post("/users", data);
export const updateUser = (id, data) => axiosClient.put(`/users/${id}`, data);
export const deactivateUser = (id) => axiosClient.patch(`/users/${id}/deactivate`);
```

**`stockApi.js`:**
```javascript
export const recordStockIn = (data) => axiosClient.post("/stock/in", data);
export const recordStockOut = (data) => axiosClient.post("/stock/out", data);
export const getTransactions = (params) => axiosClient.get("/stock/transactions", { params });
```

**`reportsApi.js`:**
```javascript
export const getInventoryReport = () => axiosClient.get("/reports/inventory");
export const getLowStockReport = () => axiosClient.get("/reports/low-stock");
export const getStockInReport = () => axiosClient.get("/reports/stock-in");
export const getStockOutReport = () => axiosClient.get("/reports/stock-out");
```

---

## 4.6 Session Management

**File:** `src/utils/auth.js`

This file manages the user's login session using the browser's **localStorage** — a built-in key-value store that persists even after the browser is closed.

| Function | What It Does |
|----------|-------------|
| `saveSession(data)` | Stores the JWT token and user object in localStorage |
| `getUser()` | Retrieves and parses the stored user object |
| `getToken()` | Retrieves the raw JWT token string |
| `isLoggedIn()` | Returns `true` if a user object exists in localStorage |
| `logout()` | Removes both the token and user from localStorage |

**Storage keys used:**
- `ims_token` — The JWT authentication token
- `ims_user` — The user profile object (as a JSON string)

---

## 4.7 Reusable Components

These small components are used across multiple pages to maintain consistent UI.

### PageHeader
**Props:** `title`, `subtitle`
**Renders:** A large heading and a smaller description below it.
**Used on:** Every single page.

### DashboardCard
**Props:** `title`, `value`, `description`
**Renders:** A styled card showing a metric (e.g., "Products: 12").
**Used on:** Dashboard page only.

### StatusBadge
**Props:** `status`
**Renders:** A colored pill badge:
- Green for "Active"
- Red for "Inactive"
- Yellow for "Low Stock"
**Used on:** Products page, Users page.

### EmptyState
**Props:** `message`
**Renders:** A centered message with a dashed border, shown when a table has no data.
**Used on:** Every page that has a data table.

### LoadingMessage / ErrorMessage / SuccessMessage
**Props:** `message`
**Renders:** Styled notification banners:
- Blue for loading
- Red for errors
- Green for success
**Used on:** Every page that makes API calls.

---

## 4.8 Page-by-Page Walkthrough

### Login Page (`LoginPage.js`)

**URL:** `/login`

**What the user sees:** A centered card with username and password fields, a Login button, and a credential note.

**What happens behind the scenes:**
1. User types username and password → stored in `formData` state.
2. User clicks Login → `handleSubmit` runs.
3. Frontend validates that both fields are filled.
4. Calls `loginUser(formData)` which sends a POST to `/api/auth/login`.
5. If successful: saves the token and user data to localStorage, navigates to `/dashboard`.
6. If failed: displays the error message from the backend.

### Dashboard Page (`DashboardPage.js`)

**URL:** `/dashboard`

**What the user sees:** Four summary cards: Products count, Categories count, Low Stock count, Transactions count.

**What happens behind the scenes:**
1. On page load, `useEffect` triggers `loadStats()`.
2. Three API calls run in parallel using `Promise.all()`:
   - `getProducts()` — to count products and calculate low stock
   - `getCategories()` — to count categories
   - `getTransactions()` — to count transactions
3. Low stock is calculated client-side: `products.filter(p => p.quantityInStock <= p.reorderLevel)`.
4. The counts are displayed in `DashboardCard` components.

### Users Page (`UsersPage.js`)

**URL:** `/users` (Admin only)

**What the user sees:** A form to create/edit users and a table listing all users with Edit, Deactivate, and Activate buttons.

**Key behaviors:**
- **Create Mode:** Form is empty. Submit button says "Add User". POST request is sent.
- **Edit Mode:** Clicking "Edit" populates the form with the user's current data. A blue "Editing Mode" banner appears. Submit button changes to "Update User". PUT request is sent.
- **Cancel Edit:** Clicking "Cancel" on the editing banner clears the form and exits edit mode.
- **Deactivate:** Shows a confirmation dialog. Sends a PATCH request to set status to "Inactive".
- **Activate:** Shows a confirmation dialog. Sends a PUT request with `{ status: "Active" }`.
- **Password handling:** When editing, the password field is blank. If left blank, the existing password is preserved.

### Categories Page (`CategoriesPage.js`)

**URL:** `/categories` (Admin only — enforced by sidebar visibility; backend protects POST/PUT)

**What the user sees:** A form to create/edit categories and a table listing all categories with an Edit button.

**Key behaviors:**
- Same Create/Edit pattern as Users page.
- Only two fields: Category Name and Description.
- The editing banner shows which category is being edited.

### Products Page (`ProductsPage.js`)

**URL:** `/products`

**What the user sees:** A form (admin only), a search bar, a category filter dropdown, and a product table with stock level indicators.

**Key behaviors:**
- **Admin-only form:** The create/edit form is wrapped in `{isAdmin && (...)}`, so Staff users only see the table.
- **Search:** Filters products client-side by product name or code (case-insensitive).
- **Category filter:** Filters products by their category.
- **Filtering uses `useMemo`:** The filtered product list is only recalculated when `products`, `search`, or `categoryFilter` change. This is a React performance optimization.
- **Low Stock indicator:** If `quantityInStock <= reorderLevel`, a yellow "Low Stock" badge appears.
- **Description tooltip:** Hovering over a product name shows the description via the HTML `title` attribute.
- **Category display:** Uses `getCategoryName()` helper to handle both populated objects and raw IDs.

### Stock-In Page (`StockInPage.js`)

**URL:** `/stock-in`

**What the user sees:** A form with a product dropdown, quantity input, and optional remarks field.

**Key behaviors:**
1. Loads all active products on mount.
2. User selects a product, enters a quantity, and optionally adds remarks.
3. Frontend validates: product must be selected, quantity must be > 0.
4. Sends POST to `/api/stock/in`.
5. On success: clears the form and refreshes the product list.

### Stock-Out Page (`StockOutPage.js`)

**URL:** `/stock-out`

**What the user sees:** Same as Stock-In, but with an "Available Stock" indicator that updates when a product is selected.

**Key behaviors:**
- When a product is selected, the available stock is calculated:
  ```javascript
  const selectedProduct = products.find(p => p._id === form.productId);
  const availableQuantity = selectedProduct?.quantityInStock ?? 0;
  ```
- Frontend validates that the requested quantity does not exceed available stock (before the backend also checks this).
- Sends POST to `/api/stock/out`.

### Transactions Page (`TransactionsPage.js`)

**URL:** `/transactions`

**What the user sees:** A filter dropdown (All / Stock In / Stock Out) and a table showing all stock movement history.

**Table columns:** Date, Product, Type, Quantity, Previous Stock, New Stock, Processed By, Remarks.

**Key behaviors:**
- Loads all transactions on mount.
- Filtering is done client-side (no additional API call needed).
- Dates are formatted using `new Date().toLocaleString()`.

### Reports Page (`ReportsPage.js`)

**URL:** `/reports`

**What the user sees:** Four toggle buttons (Current Inventory, Low Stock, Stock-In, Stock-Out) and a table that changes based on the selected report.

**Key behaviors:**
- Uses `activeReport` state to track which report is selected.
- When the selected report changes, `useEffect` triggers a new API call to the corresponding endpoint.
- The table headers and row rendering functions change based on whether the report is product-based (Inventory, Low Stock) or transaction-based (Stock-In, Stock-Out).

---

## 4.9 CSS Architecture

The frontend uses three CSS files:

### `App.css` (330 lines) — Global Styles
Contains styles for ALL pages including:
- Global reset (box-sizing)
- Page header typography
- Dashboard grid and cards
- Form card layout (4-column grid)
- Form group labels
- Input and select styling
- Button variants (primary, edit, danger, success)
- Data table styling
- Status badges (Active, Inactive, Low Stock)
- Status messages (success, error, loading)
- Empty state placeholder
- Stock note indicator

### `layout.css` (170 lines) — Layout & Sidebar
Contains styles for the persistent layout:
- App layout (flexbox with sidebar + content)
- Sidebar (dark gradient background, 250px width, sticky)
- Brand section
- User profile card
- Navigation links with active/hover states
- Section labels
- Logout button

### `login.css` (81 lines) — Login Page
Contains styles exclusively for the login page:
- Centered card layout
- Login-specific input styling
- Error message styling
- Test account note styling

---

## 4.10 Frontend Environment Variables

**File:** `frontend/.env`

| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `REACT_APP_API_BASE_URL` | `https://ipt-project-backend-vercel.vercel.app/api` | The backend API URL. Defaults to `http://localhost:5000/api` if not set. |

> **Note:** In React (Create React App), environment variables MUST start with `REACT_APP_` to be accessible in the browser. This is a security measure — CRA only injects variables with this prefix into the build.
