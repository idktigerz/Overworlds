var pool = require('./connection.js')

module.exports.getAllRooms = async function() {
    try {
      let sql = `SELECT roo_id, roo_name FROM rooms`;
      let result = await pool.query(sql);
      let rooms = result.rows;
      return { status: 200, result: rooms};
    } catch (err) {
      console.log(err);
      return { status: 500, result: err};
    }
  }  
  
module.exports.getRoomById = async function (id) {
  try {
    let sql = `SELECT mch_id FROM matches WHERE mch_id = $1`;
    let result = await pool.query(sql, [id]);
    if (result.rows.length > 0) {
      let room = result.rows[0];
      return { status: 200, result: room };
    } else {
      return { status: 404, result: { msg: "No room with that id" } };
    }
  } catch (err) {
    console.log(err);
    return { status: 500, result: err };
  }
}