const res = require('express/lib/response');
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
    let sql = `SELECT room_id FROM room WHERE room_id = $1`;
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

/* module.exports.createRoom = async function (id){
  try{
    let checksql = `SELECT mch_id FROM matches WHERE mch_id = $1`;
    let createsql = `INSERT INTO matches VALUES `;
    let check_result = await pool.query(checksql, [player.username]);
    let result = await pool.query(createsql );
    if (check_result.rows.lenght == 0){

    }
  }catch (err){

  }
}
 */
module.exports.createRoom = async function (playerID){
  try{
    let sql = `Select room.room_id from room, player where room.room_is_full = false 
              and room.room_id not in (SELECT room_has_player.room_room_id FROM room_has_player WHERE room_has_player.ply_ply_id = $1) GROUP BY room.room_id`
    let result = await pool.query(sql, [playerID]);
    if (result.rows.length > 0){
      const roomID = result.rows[0].room_id;
      sql = `INSERT into room_has_player (ply_ply_id, room_room_id) VALUES ($1, $2);`
      result = await pool.query(sql, [playerID, roomID]);
      
      sql = `SELECT COUNT(*) as Number_Of_Players FROM room_has_player WHERE room_room_id = $1`
      result = await pool.query(sql, [roomID]);
      if (result.rows[0].as_Number_Of_Players == 2){
        sql = "UPDATE room SET room_is_full = true WHERE room_id = $1"
        result = await pool.query(sql, [roomID]);
      }
      return { status: 200, result: {roomID: roomID} };
    }else{
      return {status: 404, result: {roomID: -1}}
    }
  }catch (err){
    console.log(err);
    return { status: 500, result: err };
  }
}