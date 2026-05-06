const sqlite3 = require("sqlite3").verbose();

// Create database connection
const PORT = process.env.PORT || 3001;

const db = new sqlite3.Database(`./catalog_${PORT}.db`, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log(`Connected to SQLite database for PORT ${PORT}`);
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
        (4, 'Cooking for the Impatient Undergrad', 'undergraduate school', 5, 25),
        (5, 'How to finish Project 3 on time', 'distributed systems', 10, 35),
        (6, 'Why theory classes are so hard', 'education', 12, 40),
        (7, 'Spring in the Pioneer Valley', 'literature', 8, 45)
    `);
});

module.exports = db;