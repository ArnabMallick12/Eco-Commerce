const express = require("express");
const mongoose = require("mongoose");

const port = 3000;

const app = express();

main().then(()=>{
    console.log("Database was successfully connected!");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecocommerce');
}

app.listen(port, ()=>{
    console.log(`Sever running on port : ${port}`);
});

app.get('/',(req,res)=>{
    res.send("Server is running now!")
});