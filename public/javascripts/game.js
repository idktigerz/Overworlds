const room = sessionStorage.getItem("roomId"); 

window.onload = async function() {
    let cardInfo = await requestAllCardsInfo()
    document.getElementById("cardName").innerHTML = cardInfo.cards_crd_name;
    document.getElementById("cardType").innerHTML = cardInfo.cards_types_tp_name;
    document.getElementById("cardCost").innerHTML = cardInfo.card_crd_cost;
    document.getElementById("cardAttack").innerHTML = cardInfo.cards_crd_atk;
}
