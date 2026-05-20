const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- IMS Week 14 Backend Tests ---');
  let adminToken = '';
  let staffToken = '';
  let productId = '';
  let categoryId = '';

  // BE-W14-01: Login Admin
  let res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  let data = await res.json();
  console.log(`BE-W14-01: Admin Login -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);
  adminToken = data.token;

  // BE-W14-02: Invalid Password
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  console.log(`BE-W14-02: Invalid Login -> ${res.status === 401 || res.status === 400 ? 'PASS' : 'FAIL'} (${res.status})`);

  // BE-W14-03: Get Users (Admin)
  res = await fetch(`${BASE_URL}/api/users`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  data = await res.json();
  console.log(`BE-W14-03: Get Users (Admin) -> ${res.status === 200 && Array.isArray(data) ? 'PASS' : 'FAIL'}`);

  // Setup Staff user for test 04
  const uniqueId = Date.now();
  await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ fullName: 'Test Staff', username: `staff_${uniqueId}`, password: 'password123', role: 'Staff', status: 'Active' })
  });
  let staffRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: `staff_${uniqueId}`, password: 'password123' })
  });
  let staffData = await staffRes.json();
  staffToken = staffData.token;

  // BE-W14-04: Get Users (Staff)
  res = await fetch(`${BASE_URL}/api/users`, {
    headers: { 'Authorization': `Bearer ${staffToken}` }
  });
  console.log(`BE-W14-04: Get Users (Staff) -> ${res.status === 403 ? 'PASS' : 'FAIL'} (${res.status})`);

  // Setup categories for product tests
  res = await fetch(`${BASE_URL}/api/categories`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  const categories = await res.json();
  categoryId = categories[0]?._id;
  if (!categoryId) {
    let catRes = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ categoryName: 'Test Category', description: 'Test' })
    });
    let catData = await catRes.json();
    categoryId = catData._id;
  }

  // Setup: Get an existing product to test duplicates
  res = await fetch(`${BASE_URL}/api/products`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  const products = await res.json();
  let existingProduct = products[0];
  if (!existingProduct) {
     let pRes = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ productCode: 'P-999', productName: 'Test', categoryId, unitOfMeasure: 'Box', quantityInStock: 10, reorderLevel: 2, price: 100 })
      });
      existingProduct = await pRes.json();
  }
  productId = existingProduct._id;

  // BE-W14-05: Duplicate Product Code
  res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productCode: existingProduct.productCode, productName: 'Test2', categoryId, unitOfMeasure: 'Box' })
  });
  console.log(`BE-W14-05: Duplicate Product -> ${res.status === 400 ? 'PASS' : 'FAIL'}`);

  // BE-W14-06: Negative Quantity
  res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productCode: 'P-NEW', productName: 'Test2', categoryId, unitOfMeasure: 'Box', quantityInStock: -5 })
  });
  console.log(`BE-W14-06: Negative Quantity -> ${res.status === 400 ? 'PASS' : 'FAIL'}`);

  // BE-W14-07: Stock In with Quantity 0
  res = await fetch(`${BASE_URL}/api/stock/in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productId, quantity: 0, remarks: 'Test' })
  });
  console.log(`BE-W14-07: Stock-in Qty 0 -> ${res.status === 400 ? 'PASS' : 'FAIL'}`);

  // BE-W14-08: Stock Out above available
  res = await fetch(`${BASE_URL}/api/stock/out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productId, quantity: 999999, remarks: 'Test' })
  });
  console.log(`BE-W14-08: Stock-out above available -> ${res.status === 400 ? 'PASS' : 'FAIL'}`);

  // BE-W14-09: Get Transactions
  res = await fetch(`${BASE_URL}/api/stock/transactions`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-W14-09: Get Transactions -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-W14-10: Get Inventory Report
  res = await fetch(`${BASE_URL}/api/reports/inventory`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-W14-10: Get Inventory Report -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-W14-11: Get Low Stock Report
  res = await fetch(`${BASE_URL}/api/reports/low-stock`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-W14-11: Get Low Stock Report -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-W14-12: Get Stock In Report
  res = await fetch(`${BASE_URL}/api/reports/stock-in`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-W14-12: Get Stock-in Report -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-W14-13: Get Stock Out Report
  res = await fetch(`${BASE_URL}/api/reports/stock-out`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-W14-13: Get Stock-out Report -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-W14-14: Swagger UI
  res = await fetch(`${BASE_URL}/api-docs/`);
  const html = await res.text();
  console.log(`BE-W14-14: Swagger UI -> ${res.status === 200 && html.includes('swagger') ? 'PASS' : 'FAIL'}`);
}

runTests().catch(console.error);
