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

module.exports.getCardByID = async function(deckId){
    try {
        let deckSql = `select * from cards where crd_id = (select dk_crd_id from deck where dk_id = $1)`
        let card = await pool.query(deckSql, [deckId]);
        return { status: 200, result: card};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err}
    }
}