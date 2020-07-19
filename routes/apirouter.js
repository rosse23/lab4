
var express = require('express');
var router = express.Router();
var USER = require('../database/users');
const validation=require('../utils/valid');
const {createToken} = require('../token/serviceT');
const auth= require('../token/auth');
var sha1 = require("sha1");
var fileUpload = require("express-fileupload")
router.use(fileUpload({
    fileSize: 10 * 1024 * 1024
}));

router.post('/user', async (req, res) => {
    var params = req.body;
    var errors = [];
    const e1=await validation.checkParams(params)
    const e2=await validation.checkPassword(params.password)
    const e3=await validation.checkEmail(params.email)
    if(e1) errors.push({ error: e1 })
    if(e2) errors.push({ error: e2 })
    if(e3) errors.push({ error: e3 })
    if (errors.length > 0)
        return res.status(400).json(errors);
    else {
        params["registerdate"] = new Date();
        var users = new USER(params);
        await users.save((err, usersaved) => {
            if(err) return res.status(500).send({message: `Error en el servidor ${err}`});
            if(usersaved){
                token = createToken(usersaved.id)
                res.status(200).send({
                usuario: usersaved,
                token: token 
            });
            }
        })}
});
router.get("/Alluser", auth, async (req, res) => {
    console.log(req.uId);
    const users = await USER.find({})
    res.status(200).json(users)
});
router.put("/updateavatar", auth, async (req, res) => {
    const users = await USER.findOne({_id:req.uId})
    var image = req.files.image;
    console.log(image)
    console.log(users)
    console.log(__dirname)
    var path = __dirname.replace(/\/routes/g, "/images");
    var random = Math.random().toString(); 
    var sing  = sha1(random).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + image.name.replace(/\s/g,"_");
    image.mv(totalpath, async(err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
       users.pathimage= totalpath;
       users.hash = sha1(totalpath);
       users.relativepathimage = "/v1.0/api/getfile/?id=" + users["hash"];
    users.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR "})
                return;
            }
            return res.status(200).json("Se añadio el avatar "+ image.name);
        });
    })
});

router.get("/viewImage", auth, async (req, res) => {
    var id = req.query.id;
    const users = await USER.findOne({_id:id})
    var path = users.pathimage
    if(!path){
        return res.status(300).send({msn : "Error este usuario no tiene avatar"});
    }
    else{
        return res.sendFile(path);
    }
});

router.get("/user", async (req, res) => {
    var params = req.query;
    console.log(params);
    var limit = 100;
    if (params.limit != null) {
        limit = parseInt(params.limit);
    }
    var order = -1;
    if (params.order != null) {
        if (params.order == "desc") {
            order = -1;
        } else if (params.order == "asc") {
            order = 1;
        }
    }
    var skip = 10;
    if (params.skip != null) {
        skip = parseInt(params.skip);
    }
    USER.find({}).limit(limit).sort({ _id: order }).skip(skip).exec((err, docs) => {
        console.log(err)
        res.status(200).json(docs);
        console.log(docs)
    });
});

router.patch("/user",auth, (req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "Error no existe id"
        });
        return;
    }
    var id = req.query.id;
    var params = req.body;
    USER.findOneAndUpdate({ _id: id }, params, (err, docs) => {
        res.status(200).json(docs);
    });
});

router.delete("/user",auth, async (req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
            msn: "Error no existe id"
        });
        return;
    }
    var r = await USER.remove({ _id: req.query.id });
    res.status(300).json(r);
});



module.exports = router;