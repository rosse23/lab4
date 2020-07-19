
var express = require('express');
var router = express.Router();
var USER = require('../database/users');

router.post('/user', async (req, res) => {
    var params = req.body;
    params["registerdate"] = new Date();
    var users = new USER(params);
    var result = await users.save();
    res.status(200).json(result);
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