async function registerUser() {
    try {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let player = {
            username: username,
            password: password
        };
        let result = await register(player);
        if (result.inserted) {
            alert("Register was successful");
            window.location = "login.html"
        } else {
            document.getElementById("result").innerHTML = "Username not available";
        }
    } catch (err) {
        console.log(err);
    }
}