const express = require("express");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());





app.listen(3001, () => {
    console.log("Catalog running on port 3001");
});

//search by topic
const searchRoute=require("./routes/search");
app.use("/",searchRoute);

//get book info by id
const infoRoute=require("./routes/info");
app.use("/",infoRoute);

//uypdate book price or quantity
const updateRoute=require("./routes/update");
app.use("/",updateRoute);