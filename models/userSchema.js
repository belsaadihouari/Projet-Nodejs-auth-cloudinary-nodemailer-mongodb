const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
// define the Schema (the structure of the article)
const userAuth = new Schema({
  username: String,
  email: String,
  password: String,
    img:String,
    public_id:String,
    confirmed:{type:Boolean,default:false}
  
  
}, { timestamps: true });



userAuth.pre("save", async function (next) {
 const salt = await bcrypt.genSalt();
 this.password = await bcrypt.hash(this.password, salt);
 next();
});

// Create a model based on that schema
const UserAuth = mongoose.model("user", userAuth);

// export the model
module.exports = UserAuth;
