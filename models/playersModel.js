var pool = require('./connection.js')
    
module.exports.loginCheck = async function (name, password) {
    try {
      let sql = `SELECT user_id from users WHERE user_name = $1 and user_password = $2`;
      let result = await pool.query(sql,[name,password]);
      if (result.rows.length == 0) {
          return { status: 401, result: {msg: "Wrong password or username."}}
      }
      let user_id = result.rows[0].user_id;
      return { status: 200, result: {msg: "Login correct", userId : user_id} };
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }
  }

  module.exports.getLoggedUserInfo = async function (playerId) {
    try {
        let sql = `SELECT user_name from users WHERE user_id = $1`;
        let result = await pool.query(sql, [playerId]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 404, result: { msg: "No user with that id" } };
        }
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }
  }

  module.exports.registerUser = async function (player){
    try {
        let check_sql = `SELECT ply_name FROM player where ply_name = $1`;//MUDA O NOME DAS TABELAS OH BOI
        let register_sql = `INSERT INTO users (user_name, user_password) VALUES ($1, $2)`;
        let result = await pool.query(register_sql, [player.name, player.password]);
        //let result = await pool.query(`INSERT INTO users (user_name, user_password) VALUES ('${player.name}', '${player.password}')`);
        return { status: 200, result: result };
      }catch(err){
         console.log(err);
         return { status: 500, result: err }
      }
  }