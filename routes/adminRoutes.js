var express = require('express');
var router = express.Router();
var aModel = require('../models/adminModel');


router.post('/reset', async function(req, res, next){
    console.log("Reset database");
    let result = await aModel.resetDatabase();
    res.status(result.status).send(result.result);
});

module.exports = router;