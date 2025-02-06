//this is part of authentiacation video of node.js- 39 min video

/*

test> use url-shortner
switched to db url-shortner
url-shortner> show collections
urls
users
url-shortner> db.users.find({})

*/

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;