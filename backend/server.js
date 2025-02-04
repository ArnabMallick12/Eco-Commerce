const express = require("express");
const mongoose = require("mongoose");

const Product = require('./models/Product.js');

const port = 3000;

const app = express();

require('dotenv/config');
const mongo_url = process.env.MONGO_URL;
main().then(()=>{
    console.log("Database was successfully connected!");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
}

app.listen(port, ()=>{
    console.log(`Sever running on port : ${port}`);
});

app.get('/',(req,res)=>{
    res.send("Server is running now!")
});

app.get('/testproduct',async (req,res)=>{
    let sample = new Product({
        name: "Organic Cotton T-Shirt",
    category: "Clothing",
    material: "Cotton",
    weight: 0.3,
    sizeFactor: 1.2,
    price: 25,
    carbonFootprint: 2.5
    });
    await sample.save();
    console.log("sample was saved")
});