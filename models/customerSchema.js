const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the article)
const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  telephone: String,
  age: Number,
  country: String,
  gendre: String,
  iduser:String,
}, { timestamps: true });

// Create a model based on that schema
const User = mongoose.model("mydataa", userSchema);

// export the model
module.exports = User;
