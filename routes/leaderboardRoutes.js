var express = require('express');
//const { request } = require('../app');
var router = express.Router();
var lModel = require("../models/leaderboardModel");

router.get('/matches', async function(req, res, next){
    console.log("Get Leaderboard info");
    let result = await lModel.getAllPlayersWins();
    res.status(result.status).send(result.result);
});
module.exports = router;