const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  admin: Boolean,
});

module.exports = mongoose.model("User",UserSchema,"users")