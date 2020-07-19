
const mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    registerdate: {type: Date},
    sex: {type: String},
    address: {type: String},
    relativepathimage: {type: String},
    pathimage:{type: String},
    hash: {type: String}
});
const USERS = mongoose.model("users", USERSCHEMA);
module.exports = USERS;