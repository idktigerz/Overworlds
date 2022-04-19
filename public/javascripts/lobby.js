/* window.onload = async function() {
    let userInfo = await getUserInfo();
    document.getElementById("username").innerHTML = userInfo.user_username;   
} */

/* function createRooms(){
    let result = await createRoom();

} */


async function selectPlayer(playerId){
    console.log(playerId);
    try {
        let result = await requestPlayerInfo(playerId);
        if (result.success) {
            window.location = "game.html"
        } else {
            document.getElementById("result").innerHTML = "Cannot join game";
        }
    } catch (err) {
        console.log(err);
    }
}