const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- IMS Week 15 Backend Tests ---');
  let adminToken = '';
  let categoryId = '';
  let productId = '';

  // BE-01
  let res = await fetch(`${BASE_URL}/api/health`);
  console.log(`BE-01: /api/health -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-02
  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  let data = await res.json();
  console.log(`BE-02: /api/auth/login -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);
  adminToken = data.token;

  // BE-03
  res = await fetch(`${BASE_URL}/api/users`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-03: /api/users -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-04
  const uniqueId = Date.now();
  res = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ fullName: 'Staff User', username: `staff_${uniqueId}`, password: 'password123', role: 'Staff' })
  });
  console.log(`BE-04: /api/users (POST) -> ${res.status === 201 ? 'PASS' : 'FAIL'}`);

  // BE-05
  res = await fetch(`${BASE_URL}/api/categories`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-05: /api/categories -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-06
  res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ categoryName: `Cat_${uniqueId}`, description: 'Test' })
  });
  let catData = await res.json();
  console.log(`BE-06: /api/categories (POST) -> ${res.status === 201 ? 'PASS' : 'FAIL'}`);
  categoryId = catData._id;

  // BE-07
  let pCode = `P-${uniqueId}`;
  res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productCode: pCode, productName: 'Test Prod', categoryId, unitOfMeasure: 'Box', quantityInStock: 10, reorderLevel: 5, price: 100 })
  });
  let prodData = await res.json();
  console.log(`BE-07: /api/products (POST) -> ${res.status === 201 ? 'PASS' : 'FAIL'}`);
  productId = prodData._id;

  // BE-08
  res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productCode: pCode, productName: 'Test Prod 2', categoryId, unitOfMeasure: 'Box', quantityInStock: 10, reorderLevel: 5, price: 100 })
  });
  console.log(`BE-08: /api/products duplicate -> ${res.status === 400 ? 'PASS' : 'FAIL'}`);

  // BE-09
  res = await fetch(`${BASE_URL}/api/stock/in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productId, quantity: 5, remarks: 'Stock in' })
  });
  console.log(`BE-09: /api/stock/in -> ${res.status === 201 ? 'PASS' : 'FAIL'}`);

  // BE-10
  res = await fetch(`${BASE_URL}/api/stock/out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productId, quantity: 2, remarks: 'Stock out' })
  });
  console.log(`BE-10: /api/stock/out -> ${res.status === 201 ? 'PASS' : 'FAIL'}`);

  // BE-11
  res = await fetch(`${BASE_URL}/api/stock/out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ productId, quantity: 99999, remarks: 'Excess out' })
  });
  console.log(`BE-11: /api/stock/out excess -> ${res.status === 400 ? 'PASS' : 'FAIL'}`);

  // BE-12
  res = await fetch(`${BASE_URL}/api/stock/transactions`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-12: /api/stock/transactions -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-13
  res = await fetch(`${BASE_URL}/api/reports/inventory`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-13: /api/reports/inventory -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-14
  res = await fetch(`${BASE_URL}/api/reports/low-stock`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-14: /api/reports/low-stock -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-15
  res = await fetch(`${BASE_URL}/api/reports/stock-in`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-15: /api/reports/stock-in -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-16
  res = await fetch(`${BASE_URL}/api/reports/stock-out`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
  console.log(`BE-16: /api/reports/stock-out -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);

  // BE-17
  res = await fetch(`${BASE_URL}/api/docs/`);
  console.log(`BE-17: /api/docs -> ${res.status === 200 ? 'PASS' : 'FAIL'}`);
}

runTests().catch(console.error);
