var pool = require('./connection.js')

module.exports.getAllPlayersWins = async function (){
    try{
      let sql = `SELECT count (*), usr_name
                 FROM matches, users
                 Where usr_id = mtc_winner
                 Group by usr_name;`
      let result = await pool.query(sql);
      if (result.rows.length > 0){
        let cards = result.rows;
        return { status: 200, result: cards };
      }else{
        return { status: 404, result: {msg: "This leaderboard has no information or no users"} };
      }
    }catch(err){
      console.log(err);
      return { status : 500, result: err };
    }
  } 
