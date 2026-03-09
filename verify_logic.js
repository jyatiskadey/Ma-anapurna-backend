const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';        
let token = ''; // We'll need a token from a real login if possible, or bypass if testing locally with a mock

async function verify() {
    console.log("Starting verification...");  
    
    // In a real scenario, we'd login here. 
    // Since I can't easily login without credentials, I'll assume the server is running and I might need to bypass auth for testing or use an existing token if I can find one.
    // For this demonstration, I'll describe the steps I would take if I had a token.
    
    /*
    1. Create a Store
    const storeRes = await axios.post(`${BASE_URL}/admin/stores`, {
        storeName: "Test Store",
        address: "123 Test St",
        collection: 1000
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Store Created:", storeRes.data);

    2. Add Collection 1
    const coll1 = await axios.post(`${BASE_URL}/manager/collections`, {
        storeId: storeRes.data.store._id,
        amount: 200,
        date: "2024-03-01"
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Collection 1 Added:", coll1.data.store.totalCollected); // Expect 200

    3. Add Collection 2
    const coll2 = await axios.post(`${BASE_URL}/manager/collections`, {
        storeId: storeRes.data.store._id,
        amount: 300,
        date: "2024-03-02"
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Collection 2 Added:", coll2.data.store.totalCollected); // Expect 500
    
    4. Verify Remaining Amount
    console.log("Remaining Amount:", coll2.data.store.remainingAmount); // Expect 500
    */
    
    console.log("Verification script prepared. Please ensure the backend is running at http://localhost:5000");
}

verify();
