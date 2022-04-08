window.onload = async function() {
    let userInfo = await getUserInfo();
    document.getElementById("username").innerHTML = userInfo.user_username;   
}

function openRoom(id) {
    sessionStorage.setItem("roomId",id);
    window.location = "game.html"
} 