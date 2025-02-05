const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
    session({
      secret: "your_secret_key",
      resave: false,
      saveUninitialized: false,
    })
  );

const Product = require('./models/Product.js');

const port = 3000;


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

app.use("/", authRoutes);

app.use("/products", productRoutes);


app.get('/',(req,res)=>{
    res.send("Server is running now!")
});

app.get('/products', async (req,res)=>{
    const products = await Product.find({});
    res.send(products);
});

app.get('/products/:id', async (req,res)=>{
    let {id} = req.params;
    const product = await Product.findById(id);
    res.send(product);
});

// app.get('/testproduct',async (req,res)=>{
//     let sample = new Product({
//         name: "Organic Cotton T-Shirt",
//     category: "Clothing",
//     material: "Cotton",
//     weight: 0.3,
//     sizeFactor: 1.2,
//     price: 25,
//     carbonFootprint: 2.5
//     });
//     await sample.save();
//     console.log("sample was saved")
// });