const mongoose = require("mongoose");
const initData = require("./data.json");
const Listing = require("../models/Product.js");

const MONGO_URL = 'mongodb+srv://arnav12006:KKWzgqh6Uz7JFic6@cluster0.onqda.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/ecocommerce';

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData);
  console.log("data was initialized");
};

initDB();