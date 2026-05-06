const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database("./catalog.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Initialize table and seed data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY,
            title TEXT,
            topic TEXT,
            quantity INTEGER,
            price INTEGER
        )
    `);

    db.run(`INSERT OR IGNORE INTO books VALUES
        (1, 'How to get a good grade in DOS in 40 minutes a day', 'distributed systems', 5, 30),
        (2, 'RPCs for Noobs', 'distributed systems', 5, 50),
        (3, 'Xen and the Art of Surviving Undergraduate School', 'undergraduate school', 5, 40),
        (4, 'Cooking for the Impatient Undergrad', 'undergraduate school', 5, 25)
    `);
});

module.exports = db;