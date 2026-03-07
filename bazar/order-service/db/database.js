const sqlite3=require("sqlite3").verbose();

const db = new sqlite3.Database("./orders.db");

//create table

db.run(`
    CREATE TABLE IF NOT EXISTS orders(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER
    
    )
    
    `);

module.exports=db;    