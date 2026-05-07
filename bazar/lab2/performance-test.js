const axios = require("axios");

const BASE_URL = "http://localhost:3000";

/* =========================
   Helper: measure time
========================= */
async function measureResponseTime(func, iterations = 50) {
    const times = [];

    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await func();
        const end = Date.now();

        times.push(end - start);
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];

    return { avg, min, max, median };
}

/* =========================
   TESTS
========================= */

// cold cache search
async function testColdSearch() {
    const topics = ["distributed systems", "education", "undergraduate school"];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    await axios.get(`${BASE_URL}/search/${topic}`);
}

// warm cache search
async function testWarmSearch() {
    await axios.get(`${BASE_URL}/search/distributed systems`);
}

// cold info
async function testColdInfo() {
    const id = Math.floor(Math.random() * 4) + 1;
    await axios.get(`${BASE_URL}/info/${id}`);
}

// warm info
async function testWarmInfo() {
    await axios.get(`${BASE_URL}/info/1`);
}

// purchase test
async function testPurchase() {
    await axios.post(`${BASE_URL}/purchase/1`);
}

/* =========================
   MAIN
========================= */
async function main() {
    console.log("================================");
    console.log("Lab 2 Performance Test (Node.js)");
    console.log("================================\n");

    console.log("Warming up cache...");
    for (let i = 0; i < 10; i++) {
        await axios.get(`${BASE_URL}/search/distributed systems`);
        await axios.get(`${BASE_URL}/info/1`);
    }

    console.log("\n1. Cold Search...");
    const coldSearch = await measureResponseTime(testColdSearch, 30);
    console.log(coldSearch);

    console.log("\n2. Warm Search...");
    const warmSearch = await measureResponseTime(testWarmSearch, 30);
    console.log(warmSearch);

    console.log("\n3. Cold Info...");
    const coldInfo = await measureResponseTime(testColdInfo, 30);
    console.log(coldInfo);

    console.log("\n4. Warm Info...");
    const warmInfo = await measureResponseTime(testWarmInfo, 30);
    console.log(warmInfo);

    console.log("\n5. Purchase...");
    const purchase = await measureResponseTime(testPurchase, 10);
    console.log(purchase);

    console.log("\n================================");
    console.log("Performance Summary");
    console.log("================================");

    console.log(`Search improvement: ${(100 * (coldSearch.avg - warmSearch.avg) / coldSearch.avg).toFixed(2)}%`);
    console.log(`Info improvement: ${(100 * (coldInfo.avg - warmInfo.avg) / coldInfo.avg).toFixed(2)}%`);
}

main().catch(err => console.error(err.message));