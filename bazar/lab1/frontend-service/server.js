const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// services URLs
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || "http://catalog-service:3001";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://order-service:3002";


// ---------------- SEARCH ----------------
app.get("/search/:topic", async (req, res) => {
    try {
        const response = await axios.get(
            `${CATALOG_SERVICE_URL}/search/${req.params.topic}`,
            { timeout: 5000 }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.log(error.message);
        res.status(503).json({
            success: false,
            message: "Catalog service unavailable"
        });
    }
});


// ---------------- BOOK INFO ----------------
app.get("/info/:id", async (req, res) => {
    try {

        const response = await axios.get(
            `${CATALOG_SERVICE_URL}/info/${req.params.id}`,
            { timeout: 5000 }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Catalog service unavailable"
        });
    }
});


// ---------------- PURCHASE ----------------
app.post("/purchase/:id", async (req, res) => {
    try {

        const response = await axios.post(
            `${ORDER_SERVICE_URL}/purchase/${req.params.id}`,
            {},
            { timeout: 5000 }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Order service unavailable"
        });
    }
});


// ---------------- UPDATE PRICE ----------------
app.put("/update/:id/price", async (req, res) => {
    try {

        const response = await axios.put(
            `${CATALOG_SERVICE_URL}/update/${req.params.id}/price`,
            req.body,
            { timeout: 5000 }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Catalog service unavailable"
        });
    }
});


// ---------------- UPDATE STOCK ----------------
app.put("/update/:id/stock", async (req, res) => {
    try {

        const response = await axios.put(
            `${CATALOG_SERVICE_URL}/update/${req.params.id}/stock`,
            req.body,
            { timeout: 5000 }
        );

        res.status(response.status).json(response.data);

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