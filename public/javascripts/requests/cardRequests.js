async function requestCardsInfo() {
    try {
        const response = await fetch(`/api/cards`);
        var result = await response.json();
        return result;
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
    }
}

async function requestCardInfoById(deckId){
    try {
        const response = await fetch(`/api/cards/${deckId}`)
        var card = await response.json();
        return card;
    } catch (err) {
        console.log(err);
    }
}