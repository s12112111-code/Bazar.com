const express=require("express");
const router=express.Router();
const axios=require("axios");
const db = require("../db/database");
const catalogServers = [
    "http://localhost:5001",
    "http://localhost:5002"
];
router.post("/purchase/:id", async(req,res)=>{
    const itemId=req.params.id;

    try{
        //get book info from catalog service
        const server = catalogServers[Math.floor(Math.random() * catalogServers.length)];
        const response = await axios.get(`${server}/info/${itemId}`);
        const book = response.data;

        //check quantity
        if(book.quantity <=0){
            return res.status(400).json({message:"Book out of stock"});

        }

           
           
           for (let server of catalogServers) {
            await axios.put(`${server}/update/${itemId}/stock`, {
                quantity_change: -1
            });
}
        
        //save order
        db.run(
            "INSERT INTO orders (item_id) VALUES (?)",
            [itemId],

           async function(err){
                if (err){
                    return res.status(400).json({error:err.message});
                }
                await axios.post("http://localhost:3000/invalidate/" + itemId);
                res.json({
                    message: `bought book ${book.title}` ,
                    order_id:this.lastID
                })
            }
            
        );
    }catch (error) {
         console.log("ERROR:", error.message);
    console.log("DATA:", error.response?.data);

        res.status(500).json({ message: "Error contacting catalog service" });
    }
});
module.exports=router;