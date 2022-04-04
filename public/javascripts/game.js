const room = sessionStorage.getItem("roomId");

window.onload = async function() {
    let userInfo = await getUserInfo();
    document.getElementById("username").innerHTML = userInfo.user_name;
    if (!room) {
        alert("No room choosen!");
        window.location="lobby.html";
    }
}

function leaveGame(){
    if (confirm("Are you sure you want to forfeit?")) {
        window.location = "lobby.html"
    }
}
