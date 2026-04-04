const express = require("express");
const router = express.Router();
const db = require("../db/database");


// ================= UPDATE PRICE =================
router.put("/update/:id/price", (req, res) => {
    const id = req.params.id;
    const { price } = req.body;

    if (price === undefined) {
        return res.status(400).json({
            success: false,
            message: "Price is required"
        });
    }

    if (price <= 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be greater than 0"
        });
    }

    const sql = "UPDATE books SET price = ? WHERE id = ?";

    db.run(sql, [price, id], function (err) {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.json({
            success: true,
            message: "Price updated successfully"
        });

    });
});


// ================= UPDATE STOCK =================
router.put("/update/:id/stock", (req, res) => {
    const id = req.params.id;
    const { quantity_change } = req.body;

    if (quantity_change === undefined) {
        return res.status(400).json({
            success: false,
            message: "quantity_change is required"
        });
    }

    // get current quantity first
    db.get("SELECT quantity FROM books WHERE id = ?", [id], (err, book) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        const newQuantity = book.quantity + quantity_change;

        if (newQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot reduce stock below 0. Current: ${book.quantity}, Requested change: ${quantity_change}`
            });
        }

        db.run(
            "UPDATE books SET quantity = ? WHERE id = ?",
            [newQuantity, id],
            function (err) {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                res.json({
                    success: true,
                    message: "Stock updated successfully",
                    new_quantity: newQuantity
                });

            }
        );
    });
});

module.exports = router;