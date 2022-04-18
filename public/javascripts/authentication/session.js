const { getUserID } = require("../../../models/playersModel");

async function logoutUser() {
    try {
        let result = await logout();
        window.location = "login.html"
    } catch (err) {
        console.log(err);
    }
}

/* async function getUserInfo() {
    try {
        let result = await requestUserInfo();
        if (result.logged) {
           return result.result;
        } else {
            alert ("You are not logged in\nWe will send you to login page");
            window.location = "login.html"
        }
    } catch(err) {
        console.log(err);
    }
} */

async function getPlayerInfo(id) {
    try {
        let result = await requestPlayerInfo(id);
        if (result.success) {
           return result.result;
        } else {
            alert ("You did not choose a player. \nYou will now be redirected to the lobby page.");
            window.location = "index.html"
        }
    } catch(err) {
        console.log(err);
    }
}
