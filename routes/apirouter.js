
var express = require('express');
var router = express.Router();
var USER = require('../database/users');
const validation=require('../utils/valid');
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
        var result = await users.save();
        res.status(200).json(result);
    }
});
router.get("/user", async (req, res) => {
const users = await USER.find({})
    res.status(200).json(users)
});
/*
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
        res.status(200).json(docs);
        console.log(docs)
    });
});
*/
router.patch("/user", (req, res) => {
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

router.delete("/user", async (req, res) => {
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