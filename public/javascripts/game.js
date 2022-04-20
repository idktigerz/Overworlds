const room = sessionStorage.getItem("roomId");
var cardInfo 

window.onload = async function() {
    cardInfo = await getAllCardsInfo()
    document.getElementById("cardName").innerHTML = cardInfo.card_crd_name;
    document.getElementById("cardType").innerHTML = cardInfo.card_types_tp_name;
    document.getElementById("cardCost").innerHTML = cardInfo.card_crd_cost;
    document.getElementById("cardAttack").innerHTML = cardInfo.card_crd_atk;
}


module.exports.cardsInfo = cardInfo