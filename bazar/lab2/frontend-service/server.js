const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

/* ================================
   LOAD BALANCING
================================ */
const catalogServers = [
    "http://localhost:3001"
];

const orderServers = [
    "http://localhost:3002"
];

let catalogIndex = 0;
let orderIndex = 0;

function getCatalogServer() {
    const server = catalogServers[catalogIndex];
    catalogIndex = (catalogIndex + 1) % catalogServers.length;
    return server;
}

function getOrderServer() {
    const server = orderServers[orderIndex];
    orderIndex = (orderIndex + 1) % orderServers.length;
    return server;
}

/* ================================
   CACHE 
================================ */
const cache = new Map();
const CACHE_LIMIT = 5;

function setCache(key, value) {
    if (cache.has(key)) {
        cache.delete(key);
    }

    cache.set(key, value);

    if (cache.size > CACHE_LIMIT) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
}

function getCache(key) {
    if (!cache.has(key)) return null;

    const value = cache.get(key);

    // LRU update
    cache.delete(key);
    cache.set(key, value);

    return value;
}

// ---------------- SEARCH(cashed) ----------------
app.get("/search/:topic", async (req, res) => {

    const start = Date.now();

    const key = `search-${req.params.topic}`;

    const cached = getCache(key);
    if (cached) {
        const end = Date.now();

        console.log("CACHE HIT");

        return res.json({
            source: "CACHE",
            time: end - start,
            data: cached
        });
    }

    console.log("CACHE MISS");

    const server = getCatalogServer();
    console.log("Using catalog server:", server);

    const response = await axios.get(
        `${server}/search/${req.params.topic}`
    );

    setCache(key, response.data);

    const end = Date.now();

    return res.json({
        source: "SERVER",
        time: end - start,
        data: response.data
    });
});

// ---------------- BOOK INFO(cashed) ----------------
app.get("/info/:id", async (req, res) => {

    const start = Date.now(); // ⏱ start timer

    const key = `book-${req.params.id}`;

    const cached = getCache(key);
    if (cached) {
        const end = Date.now();

        console.log("CACHE HIT");

        return res.json({
            source: "CACHE",
            time: end - start,
            data: cached
        });
    }

    console.log("CACHE MISS");

    try {
        const server = getCatalogServer();
        console.log("Using catalog server:", server);

        const response = await axios.get(
            `${server}/info/${req.params.id}`,
            { timeout: 5000 }
        );

        setCache(key, response.data);

        const end = Date.now();

        return res.json({
            source: "SERVER",
            time: end - start,
            data: response.data
        });

    } catch (error) {
        return res.status(503).json({
            success: false,
            message: "Catalog service unavailable"
        });
    }
});

// ---------------- PURCHASE(cashed) ----------------
app.post("/purchase/:id", async (req, res) => {
    try {

        const server = getOrderServer();
        console.log("Using catalog server:", server);
        const response = await axios.post(
            `${server}/purchase/${req.params.id}`,
            {},
            { timeout: 5000 }
        );

          // invalidate cache
        cache.clear();

        res.json(response.data);

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Order service unavailable"
        });
    }
});


// ---------------- UPDATE PRICE(cashed) ----------------
app.put("/update/:id/price", async (req, res) => {
    try {

        const server = getCatalogServer();
        console.log("Using catalog server:", server);
        const response = await axios.put(
            `${server}/update/${req.params.id}/price`,
            req.body,
            { timeout: 5000 }
        );

        cache.clear();

        res.json(response.data);

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Catalog service unavailable"
        });
    }
});


// ---------------- UPDATE STOC(cashed) ----------------
app.put("/update/:id/stock", async (req, res) => {
    try {

         const server = getCatalogServer();
        console.log("Using catalog server:", server);
        const response = await axios.put(
            `${server}/update/${req.params.id}/stock`,
            req.body,
            { timeout: 5000 }
        );

        
        cache.clear();

        res.json(response.data);


    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Catalog service unavailable"
        });
    }
});


// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Frontend service running on port ${PORT}`);
});