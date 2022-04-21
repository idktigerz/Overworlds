async function getRoom(roomId) {
    try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (response.status == 200) {
           var room = await response.json();
           return room;
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function play(roomId, card) {
    try {
        const response = await fetch(`/api/rooms/${roomId}/plays`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({ cardPlayed: card}) 
        });
        if (response.status == 200) {
           var result = await response.json();
           return result;
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function getRooms() {
    try {
        const response = await fetch(`/api/rooms`);
        if (response.status == 200) {
           var rooms = await response.json();
           return rooms;
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function getRoomById(matchID){
    try {
        const response = await fetch(`/api/rooms/${matchID}`)
        if(response.status == 200){
            var room = await response.json();
            return room;
        }else{
            console.log(response);
        }
    }catch (err){
        console.log(err)
    }
}

async function createRoom(name){
    try {
        const response = await fetch(`/api/rooms/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(name) 
        });
        var result = await response.json();
        return {created: response.status==200 , result: result};
    } catch (err) {
        console.log(err);
        return {created: response.status==404 , result: err};
    }
}

async function getMatch(){
    try{
        const response = await fetch(`/api/rooms/match`)
        if(response.status == 200){
            var match = await response.json();
            return match;
        }else{
            console.log(response);
        }        
    }catch(err){
        console.log(err)
    }
}