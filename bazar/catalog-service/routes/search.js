const express = require("express");
const router = express.Router();
const db = require("../db/database");

//search by topic
router.get("/search/:topic",(req,res)=>{
    const topic=req.params.topic;

    db.all(
        "SELECT id,title FROM books WHERE topic=?",
        [topic],
        (err,rows)=>{
            if(err){
                return res.status(500).json({error:err.message});

            }
            if(rows.length === 0){
                return res.status(404).json({message:"No books found."});

            }

            res.json(rows);
        }
    );
});

module.exports=router;