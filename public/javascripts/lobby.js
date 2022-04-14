window.onload = async function() {
    let userInfo = await getUserInfo();
    document.getElementById("username").innerHTML = userInfo.user_username;   
}

function createRooms(){
    let result = await createRoom();

}

function selectPlayer1(){
    let result = await selectPlayerID1();

}

function selectPlayer2(){
    let result = await selectPlayerID2();

}