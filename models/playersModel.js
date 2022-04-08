var pool = require('./connection.js')
    
module.exports.loginCheck = async function (name, password) {
    try {
      let sql = `SELECT user_id from users WHERE user_username = $1 and user_password = $2`;
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
        let sql = `SELECT user_username from users WHERE user_id = $1`;
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
        let check_sql = `SELECT user_username FROM users where user_username = $1`;//MUDA O NOME DAS TABELAS OH BOI
        let register_sql = `INSERT INTO users (user_username, user_password) VALUES ($1, $2)`;
        let check_result = await pool.query(check_sql, [player.username]);
        let result = await pool.query(register_sql, [player.username, player.password]);
        if (check_result.rows.length == 0) {
          return { status: 200, result: result};
        }else{
          return { status: 401, result: {msg: "Username not available"} };
        }
      }catch(err){
         console.log(err);
         return { status: 500, result: err }
      }
  }

  module.exports.getUserID = async function (playerId) {
    try {
        let sql = `SELECT user_id from users WHERE user_id = $1`;
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