# IPT-PROJECT Setup Instructions

## Project Structure
```
IPT-PROJECT
│
├── backend
│   ├── node_modules
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── students.json
│
├── frontend
│   ├── node_modules
│   ├── public
│   ├── src
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## Requirements
Make sure you have installed:
- Node.js (LTS recommended)
- npm (comes with Node.js)

Check versions:
```bash
node -v
npm -v
```

---

## Backend Setup (Node.js)

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run backend server
```bash
node app.js
```

### 4. Backend runs on:
http://localhost:3000
```

---

## Frontend Setup (React)

### 1. Open new terminal and go to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start React app
```bash
npm start
```

### 4. Frontend runs on:
```
http://localhost:3000 or http://localhost:3001
```
(depends on backend port conflict)

---

## Connecting Frontend and Backend

If frontend calls backend API, ensure:

### Option 1: Proxy (recommended)
In `frontend/package.json` add:
```json
"proxy": "http://localhost:3000"
```

### Option 2: Full URL in fetch
```js
fetch("http://localhost:3000/api/endpoint")
```

---

## Common Issues

### Port already in use
Change backend port in `app.js`:
```js
const PORT = 5000;
```

Then update frontend proxy accordingly.

---

## Running Both Together

Open 2 terminals:

**Terminal 1 (backend):**
```bash
cd backend
node app.js
```

**Terminal 2 (frontend):**
```bash
cd frontend
npm start
```

---

## Done
Your full stack app should now be running.
