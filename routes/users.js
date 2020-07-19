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
//MOSTRAR TODOS LOS USUARIOS
router.get("/Alluser", auth, async (req, res) => {
  console.log(req.uId);
  const users = await USER.find({})
  res.status(200).json(users)
});
//AÑADIR DATOS DE USUARIOS
router.post('/sigIn', async (req, res) => {
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

//AÑADIR LA IMAGEN DDE SUS AVATAR DE CADA USUARIO
router.put("/updateavatar", auth, async (req, res) => {
    const users = await USER.findOne({_id:req.uId})
    var image = req.files.image;
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
       users.relativepathimage = "/users/viewImage?id=" + users["hash"];
    users.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR "})
                return;
            }
            return res.status(200).json("Se añadio el avatar "+ image.name);
        });
    })
});
//LOGIN DE USUARIO
router.post("/log", async (req,res)=>{
  const datos = req.body
  const us = await USER.findOne({email:datos.email})
  if (!us) return res.send('Ud no esta registrado')
  if(datos.password!=us.password) 
    return res.send('la contraseña es incorrecta')
  token = createToken(us.id)
  res.send({
      message: "Bienvenido",
      token: token
  })
})

//MOSTRAR LA IMAGEN DE UN USUARIO CUALQUIERA INGRESANDO SU ID
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
//MOSTRAR LA IMAGEN DE TU AVATAR
router.get("/viewMyAvatar", auth, async (req, res) => {
  const users = await USER.findOne({_id:req.uId})
  var path = users.pathimage
  if(!path){
      return res.status(300).send({msn : "Ud no tiene avatar"});
  }
  else{
      return res.sendFile(path);
  }
});

module.exports = router;
