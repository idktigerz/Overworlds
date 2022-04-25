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
  
module.exports.getRoomById = async function () {
  try {
    let sql = `SELECT room_id FROM room WHERE room_id = 2`;
    let result = await pool.query(sql);
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

module.exports.placeCard = async function (roomId, playerId, cardId, newCardId){
  try{
    let sql = `SELECT room.room_id, ply.ply_id, current_card_played FROM room, player WHERE room.room_id= $1, ply.ply_id = $2`
    let result = await pool.query(sql, [playerId, roomId]);
    if (result.rows.length > 0){
      sql = `SELECT current_card_played FROM room WHERE current_card_played = $3` 
      result = await pool.query(sql, [cardId]);
      if (result.rows.length == 0){
        sql = `INSERT INTO room (current_card_played) VALUES ($3);`
        result = await pool.query(sql, [cardId]);
      }else{
        sql = `UPDATE SET current_card_played = $4 WHERE current_card_played = $3;`
        result = await pool.query(sql, [newCardId]);
      }
      return { status: 200, result: card}
    }else{
      return {status : 404, result: {msg: "No card found"}}
    }
  }catch(err){
    console.log(err);
    return { status: 500, result: err }
  }
}