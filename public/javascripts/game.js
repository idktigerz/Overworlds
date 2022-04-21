const room = sessionStorage.getItem("roomId"); 
let playerId = sessionStorage.getItem("playerId");
let adversId;

window.onload = async function() {
    try {
        let advInfo = await getAdv(playerId);
    	adversId = adv.ply_ply_id;
    } catch (err) {
        console.log(err);
    }
}

async function getCardByID(cardId){
    let cardInfo = await requestCardInfo(cardId);
    document.getElementById("cardName").innerHTML = cardInfo.crd_name;
    document.getElementById("cardType").innerHTML = cardInfo.tp_name;
    document.getElementById("cardCost").innerHTML = cardInfo.crd_cost;
    document.getElementById("cardAttack").innerHTML = cardInfo.crd_atk;
}