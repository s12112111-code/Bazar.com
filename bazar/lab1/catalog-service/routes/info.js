const express = require("express");
const router = express.Router();
const db = require("../db/database");

//get book info by id
router.get("/info/:id",(req,res)=>{
    const id=req.params.id;

    db.get(
        "SELECT title,quantity,price FROM books WHERE id=?",
        [id],
        (err,row)=>{
            if(err){
                return res.status(500).json({error:err.message});

            }

            if(!row){
                return res.status(404).json({message:"Books not found"});

            }

            res.json(row);
        }
    );
});

module.exports=router;