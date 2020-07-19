const mongoose = require("./connect");
var IMAGESCHEMA = new mongoose.Schema({
    relativepathimage: {
        type: String
    },
    pathimage: {
        type: String
    },
    hash: {
        type: String}
});
const IMAGE = mongoose.model("image",IMAGESCHEMA);
module.exports = IMAGE;