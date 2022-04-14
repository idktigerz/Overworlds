
async function login(name, password) {
    try {
        const response = await fetch(`/api/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ name: name, password: password}) 
        });
        var  result = await response.json();
        return {logged: response.status==200 , result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function register(player) {
    try {
        // TODO: Verify user information  and give errors
        const response = await fetch(`/api/users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(player) 
        });
        var  result = await response.json();
        return {inserted: response.status==200 , result: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {inserted: response.status==404 , result: err};
    }
}


async function requestUserInfo() {
    try {
        const response = await fetch(`/api/users/profile`);
        var result = await response.json();
        return {logged: response.status!=401 , result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function logout() {
    try {
        const response = await fetch(`/api/users/logout`,
        {
            method: "POST",
        });
        var  result= await response.json();
        return {success: response.status==200 , result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestPlayer1Info() {
    try {
        const response = await fetch(`/api/player1`);
        var result = await response.json();
        return { status: 200 , result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestPlayer2Info() {
    try {
        const response = await fetch(`/api/player2`);
        var result = await response.json();
        return { status: 200 , result: result };
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}