const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rewardPoints: { type: Number, default: 0 }, // ✅ Ensure this field exists
});

module.exports = mongoose.model("User", UserSchema);
