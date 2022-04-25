var express = require('express');
var router = express.Router();
var rModel = require("../models/roomsModel");
            
router.get('/', async function(req, res, next) {
    let result = await rModel.getAllRooms();
    res.status(result.status).send(result.result);
});
            
router.get('/filter', async function(req, res, next) {
    let filters = req.query;
    console.log("Get rooms filtered by:");
    console.log(filters);
    let result = await rModel.getRoomByNameOrTopCard(filters);
    res.status(result.status).send(result.result);
});

router.get('/2', async function(req, res, next) {
    console.log("Get room with id 2")
    let result = await rModel.getRoomById();
    res.status(result.status).send(result.result);
});

router.post('/create', async function(req, res, next){
    let result = await rModel.createRoom();
    res.status(result.status).send(result.result);
});

router.post('/findRoom', async function(req, res, next){
    let playerID = req.body.playerID;
    let result = await rModel.createRoom(playerID);
    res.status(result.status).send(result.result);    
});

router.post('/:id/player/card', async function(req, res, next){
    let id = req.params.id;
    let playerId = req.body.playerId;
    let cardId = req.body.cardId;
    let newCardId = req.body.newCardId;
    let result = await rModel.placeCard(id, playerId, cardId, newCardId);
    res.status(result.status).send(result.result);
});

module.exports = router;