const room = sessionStorage.getItem("roomId");

window.onload = async function() {
    let playerId = await getPlayerInfo(id);
    document.getElementById("username").innerHTML = playerId.player_ply_id;
    document.getElementById("playerHealth").innerHTML = playerId.player_ply_health;
}


