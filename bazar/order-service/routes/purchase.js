const express=require("express");
const router=express.Router();
const axios=require("axios");
const db = require("../db/database");

router.post("/purchase/:id", async(req,res)=>{
    const itemId=req.params.id;

    try{
        //get book info from catalog service
        const response=await axios.get(`http://localhost:3001/info/${itemId}`);
        const book = response.data;

        //check quantity
        if(book.quantity <=0){
            return res.status(400).json({message:"Book out of stock"});

        }

        //update quantity in catalog
        await axios.put(`http://localhost:3001/update/${itemId}`,{
            quantity:book.quantity -1
        });

        //save order
        db.run(
            "INSERT INTO orders (item_id) VALUES (?)",
            [itemId],

            function(err){
                if (err){
                    return res.status(400).json({error:err.message});
                }

                res.json({
                    message: `bought book ${book.title}` ,
                    order_id:this.lastID
                })
            }
            
        );
    }catch (error) {
        res.status(500).json({ message: "Error contacting catalog service" });
    }
});
module.exports=router;