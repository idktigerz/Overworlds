async function register() {
    try {
        let name = document.getElementById("name").value;
        let pass = document.getElementById("password").value;
        let res = await requestRegister(name,pass);
        alert(res.msg);    
        window.location = "index.html";  
    } catch (err) {
        console.log(err);
    }
}