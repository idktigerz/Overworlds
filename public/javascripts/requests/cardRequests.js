async function getCard(cardId) {
    try {
        const response = await fetch(`/api/cards/${cardId}`);
        if (response.status == 200) {
           var card = await response.json();
           return card;
        } else {
            // Treat errors like 404 here
            console.log(response);
        }
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}


async function getAllCards(){
    try{
        const response = await fetch(`/api/cards`);
        if (response.status == 200){
            var cards = response.json();
            return cards;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}

async function requestCardTrait(cardId){
    try{
        const response = await fetch(`/api/cards/${cardId}/trait`);
        if (response.status == 200){
            var card = response.json();
            return card;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}

async function requestCardType(cardId){
    try{
        const response = await fetch(`/api/cards/${cardId}/type`);
        if (response.status == 200){
            var card = response.json();
            return card;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}

async function requestAllCardsType(){
    try{
        const response = await fetch(`/api/cards/types`);
        if (response.status == 200){
            var types = response.json();
            return types;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}

async function requestCardInfo(cardId){
    try{
        const response = await fetch(`/api/cards/${cardId}/info`);
        if (response.status == 200){
            var card = response.json();
            return card;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}

async function requestAllCardsInfo(){
    try{
        const response = await fetch(`/api/cards/info`);
        if (response.status == 200){
            var cards = response.json();
            return cards;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}