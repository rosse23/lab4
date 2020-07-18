var mongoose = require('mongoose');
mongoose.connect("mongodb://172.22.0.2:27017/crud").then(function(){
    console.log("conectando a la bd")
}).catch(function(err){console.log(err)})
module.exports = mongoose;