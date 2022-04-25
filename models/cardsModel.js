var pool = require('./connection.js')

module.exports.getAllCards = async function(){
  try {
    let sql = `SELECT * FROM cards;`
    let result = await pool.query(sql);
    if (result.rows.length > 0){ 
      let cards = result.rows;
      return { status: 200, result: cards };
    }else{
      return { status: 404, result: {msg: "No cards found!"} };
    }
  }catch(err){  
    console.log(err);
    return { status: 500, result: err};
  }
}

module.exports.getCardByID = async function (cardId){
  try{
    let sql = `SELECT * FROM cards WHERE crd_id = $1;`
    let result = await pool.query(sql, [cardId]);
    if (result.rows.length > 0){
      let card = result.rows[0];
      return { status: 200, result: card};
    }else{
      return { status: 404, result: {msg: "No card found with that ID!"} };
    }
  }catch(err){
    console.err(err);
    return { status: 500, result: err };
  }
}

module.exports.getCardTrait = async function (cardId) {
  try{
    let sql = `SELECT tr_name, tr_dsc, crd_id FROM trait
               INNER JOIN cards ON crd_tr_id = tr_id
               WHERE crd_id = $1;`
    let result = await pool.query(sql, [cardId]);
    if (result.rows.length > 0){
      let card = result.rows[0];
      return { status: 200, result: card };
    }else{
      return { status: 404, result: {msg: "This card has no trait or no card found with that ID"} };
    }
  }catch(err){
    console.log(err);
    return { status : 500, result: err };
  }
}

module.exports.getCardType = async function (cardId) {
  try{
    let sql = `SELECT tp_name, tp_dsc, crd_id FROM card_types
               INNER JOIN cards ON crd_tp_id = tp_id
               WHERE crd_id = $1;`
    let result = await pool.query(sql, [cardId]);
    if (result.rows.length > 0){
      let card = result.rows[0];
      return { status: 200, result: card };
    }else{
      return { status: 404, result: {msg: "This card has no type or no card found with that ID"} };
    }
  }catch(err){
    console.log(err);
    return { status : 500, result: err };
  }
}

module.exports.getAllCardTypes = async function () {
  try{
    let sql = `SELECT tp_name, tp_dsc, crd_id FROM card_types
               INNER JOIN cards ON crd_tp_id = tp_id;`
    let result = await pool.query(sql);
    if (result.rows.length > 0){
      let card = result.rows;
      return { status: 200, result: card };
    }else{
      return { status: 404, result: {msg: "This card has no type or no card found with that ID"} };
    }
  }catch(err){
    console.log(err);
    return { status : 500, result: err };
  }
}

module.exports.getCardInfo = async function (cardId) {
  try{
    let sql = `SELECT tp_name, tp_dsc, 
               crd_id, crd_name, crd_clan, crd_family, crd_atk, crd_stk, 
               crd_hp, crd_cost, crd_count, crd_dsc, crd_img  
               FROM cards 
               INNER JOIN card_types ON crd_tp_id = tp_id
               WHERE crd_id = $1;`
    let result = await pool.query(sql, [cardId]);
    if (result.rows.length > 0){
      let card = result.rows[0];
      return { status: 200, result: card };
    }else{
      return { status: 404, result: {msg: "This card has no information or no card found with that ID"} };
    }
  }catch(err){
    console.log(err);
    return { status : 500, result: err };
  }
}

module.exports.getAllCardsInfo = async function (){
  try{
    let sql = `SELECT tp_name, tp_dsc, 
               crd_id, crd_name, crd_clan, crd_family, crd_atk, crd_stk, 
               crd_hp, crd_cost, crd_count, crd_dsc, crd_img 
               FROM cards 
               INNER JOIN card_types ON crd_tp_id = tp_id`
    let result = await pool.query(sql);
    if (result.rows.length > 0){
      let cards = result.rows;
      return { status: 200, result: cards };
    }else{
      return { status: 404, result: {msg: "This card has no information or no card found with that ID"} };
    }
  }catch(err){
    console.log(err);
    return { status : 500, result: err };
  }
}