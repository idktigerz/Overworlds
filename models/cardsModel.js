const pool = require('./connection.js');

module.exports.getCards = async function () {
    try {
        let sql = `select * from cards`;
        let res = await pool.query(sql);
        return { status: 200, result: res.rows };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.getCardByIDInDeck = async function(deckId){
    try {
        let deckSql = `select * from cards where crd_id = (select dk_crd_id from deck where dk_id = $1)`
        let card = await pool.query(deckSql, [deckId]);
        return { status: 200, result: card};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err}
    }
}

module.exports.getCardHPByID = async function(cardId){
    try {
        let cardSql = `select crd_hp from cards where crd_id = $1`
        let card = await pool.query(cardSql, [cardId]);
        return { status: 200, result: card};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err}
    }
}

module.exports.countCardsOnTable = async function(pmId){
    try {
        let countSql = `select count(*) from deck where dk_st_id = 3 and dk_pm_id = $1`
        let cards = await pool.query(countSql, [pmId]);
        return {status: 200, result: cards};
    } catch (err) {
        console.log(err)
        return {status: 500, result: err};
    }
}