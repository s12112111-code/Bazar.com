const express=require("express");
const cors=require("cors");



const app = express();
app.use(express.json());
app.use(cors());

const purchaseRoute = require("./routes/purchase");
app.use("/", purchaseRoute);


app.listen(3002, ()=>{
    console.log("Order Service running on port 3002");
});    