async function loginUser() {
    try {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let result = await login(username, password);
        if (result.logged) {
            window.location = "lobby.html"
        } else {
            document.getElementById("result").innerHTML = "Wrong username or password";
        }
    } catch (err) {
        console.log(err)
    }
}