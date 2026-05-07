const axios = require("axios");

const BASE_URL = "http://localhost:3000";

/* =========================
   Helper log
========================= */
async function log(title) {
    console.log("\n================================");
    console.log(title);
    console.log("================================");
}

/* =========================
   SEARCH TEST
========================= */
async function testSearch() {
    await log("SEARCH TEST");

    const topics = [
        "distributed systems",
        "education",
        "project management"
    ];

    for (let topic of topics) {
        try {
            const res = await axios.get(`${BASE_URL}/search/${topic}`);

            const books = res.data.data?.data || res.data.data || [];

            console.log(`Search '${topic}' -> ${books.length} books`);
            console.log(`Source: ${res.data.source || "UNKNOWN"}`);

            if (res.data.time) {
                console.log(`Response time: ${res.data.time} ms`);
            }

        } catch (err) {
            console.log(`Search '${topic}' FAILED (service issue)`);
        }
    }
}

/* =========================
   INFO TEST
========================= */
async function testInfo() {
    await log("INFO TEST");

    for (let id = 1; id <= 3; id++) {
        try {
            const res = await axios.get(`${BASE_URL}/info/${id}`);

            const book = res.data.data?.data || res.data.data;

            console.log(
                `Book ${id}: ${book.title} | Price: ${book.price} | Stock: ${book.quantity}`
            );

            console.log(`Source: ${res.data.source || "UNKNOWN"}`);

        } catch (err) {
            console.log(`Book ${id} FAILED`);
        }
    }
}

/* =========================
   CACHE TEST
========================= */
async function testCache() {
    await log("CACHE TEST");

    try {
        console.log("First request (MISS expected)");
        const first = await axios.get(`${BASE_URL}/info/1`);
        console.log("Source:", first.data.source);

        console.log("Second request (HIT expected)");
        const second = await axios.get(`${BASE_URL}/info/1`);
        console.log("Source:", second.data.source);

        const stats = await axios.get(`${BASE_URL}/cache-stats`);
        const data = stats.data.data;

        console.log("\nCache Stats:");
        console.log(`Hits: ${data.hits}`);
        console.log(`Misses: ${data.misses}`);
        console.log(`Hit Rate: ${data.hit_rate_percent}%`);

        if (second.data.source === "CACHE") {
            console.log("Cache test SUCCESS");
        } else {
            console.log("Cache test FAILED");
        }

    } catch (err) {
        console.log("Cache test failed");
    }
}

/* =========================
   PURCHASE TEST
========================= */
async function testPurchase() {
    await log("PURCHASE TEST");

    try {
        const res = await axios.post(`${BASE_URL}/purchase/2`);

        console.log("Purchase response:", res.data.message || res.data);

    } catch (err) {
        console.log("Purchase FAILED:", err.response?.data?.message || err.message);
    }
}

/* =========================
   UPDATE TEST (Replication)
========================= */
async function testUpdate() {
    await log("REPLICATION TEST (UPDATE STOCK)");

    try {
        const res = await axios.put(`${BASE_URL}/update/1/stock`, {
            quantity_change: 2
        });

        console.log("Update response:", res.data.message);

        const check = await axios.get(`${BASE_URL}/info/1`);
        const book = check.data.data?.data || check.data.data;

        console.log("After update stock:", book.quantity);

    } catch (err) {
        console.log("Update FAILED");
    }
}

/* =========================
   LOAD BALANCING TEST
========================= */
async function testLoadBalancing() {
    await log("LOAD BALANCING TEST");

    for (let i = 1; i <= 10; i++) {
        try {
            await axios.get(`${BASE_URL}/search/distributed systems`);
            console.log(`Request ${i}: OK`);
        } catch {
            console.log(`Request ${i}: FAIL`);
        }
    }

    console.log("\nLoad distribution depends on backend logs (round-robin).");
}

/* =========================
   MAIN
========================= */
async function main() {
    console.log("\nLAB 2 SYSTEM OUTPUT TEST\n");

     try {
        await axios.get(`${BASE_URL}/invalidate/1`);
    } catch {}


    await testSearch();
    await testInfo();
    await testCache();
    await testPurchase();
    await testUpdate();
    await testLoadBalancing();

    console.log("\n================================");
    console.log("END OF SYSTEM OUTPUT TEST");
    console.log("================================\n");
}

main().catch(err => console.log(err.message));