var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var fileUpload = require("express-fileupload")
var IMAGE = require("../database/images.js");
var mongoose = require("mongoose");
router.use(fileUpload({
    fileSize: 10 * 1024 * 1024
}));
router.post("/sendfile", (req, res) => {
    var image = req.files.image;
    console.log(image)
    console.log(__filename)
    console.log(__dirname)
    var path = __dirname.replace(/\/routes/g, "/images");
    var random = Math.random().toString(); 
    var sing  = sha1(random).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + image.name.replace(/\s/g,"_");
    image.mv(totalpath, async(err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
       // var meta = await metadata(totalpath);
       // console.log(meta);
       var obj = {};
       obj["pathimage"] = totalpath;
        obj["hash"] = sha1(totalpath);
        obj["relativepathimage"] = "/v1.0/api/getfile/?id=" + obj["hash"];
        var img= new IMAGE(obj);
        img.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR "})
                return;
            }
            return res.status(200).json(image.name);
        });
    })
});
   
router.get("/getfile", async(req, res, next) => {
    var params = req.query;
    if (params == null) {
        res.status(300).json({
            msn: "Error es necesario un ID"
        });
        return;
    }
    var id = params.id;
    var image =  await IMAGE.find({hash: id});
    if (image.length > 0) {
        var path = image[0].pathimage;
        res.sendFile(path);
        return;
    }
    res.status(300).json({
        msn: "Error en la petición"
    });
    return;
});

module.exports = router;