var express = require('express');
var router = express.Router();
var cModel = require("../models/cardsModel");

router.get('/', async function(req, res, next) {
    console.log("Get all cards");
    let result = await cModel.getCards();
    res.status(result.status).send(result.result);
});
  
router.get('/:id', async function(req, res, next){
  let id = req.params.id;
  console.log("Get card with ID " + id);
  let result = await cModel.getCardByID(id);
  res.status(result.status).send(result.result);
});

module.exports = router;