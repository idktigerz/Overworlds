/* window.onload = async function() {
    let userInfo = await getUserInfo();
    document.getElementById("username").innerHTML = userInfo.user_username;   
} */

/* function createRooms(){
    let result = await createRoom();

} */

async function selectPlayer(id){
    try {
        let result = await requestPlayerInfo(id);
        if (result.success) {
            window.location = "game.html"
        } else {
            document.getElementById("result").innerHTML = "Cannot join game";
        }
    } catch (err) {
        console.log(err);
    }
}