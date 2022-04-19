var express = require('express');
var router = express.Router();
var cModel = require("../models/cardsModel");

router.get('/', async function(req, res, next){
    let result = await cModel.getAllCards();
    res.status(result.status).send(result.result);
});

router.get('/:id', async function(req, res, next){
    let id = req.params.id;
    console.log("Get card with id " + id);
    let result = await cModel.getCardByID(id);
    res.status(result.status).send(result.result);
});

router.get('/:id/trait', async function(req, res, next){
    let id = req.params.id;
    console.log("Get card trait with id " + id);
    let result = await cModel.getCardTrait(id);
    res.status(result.status).send(result.result)
});

router.get('/:id/type', async function(req, res, next){
    let id = req.params.id;
    console.log("Get card type with id " + id);
    let result = await cModel.getCardType(id);
    res.status(result.status).send(result.result);
});

router.get('/:id/info', async function(req, res, next){
    let id = req.params.id;
    console.log("Get card info with id " + id);
    let result = await cModel.getCardInfo(id);
    res.status(result.status).send(result.result);
});

router.get('/info', async function(req, res, next){
    console.log("Get all cards info");
    let result = await cModel.getAllCardsInfo();
    res.status(result.status).send(result.result);
});

module.exports = router;