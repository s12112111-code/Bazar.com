const express=require("express");
const cors=require("cors");



const app = express();
app.use(express.json());
app.use(cors());

const purchaseRoute = require("./routes/purchase");
app.use("/", purchaseRoute);

const PORT = process.env.PORT || 3002;
app.listen(PORT, ()=>{
    console.log(`Order Service running on port ${PORT}`);
});    