const room = sessionStorage.getItem("roomId"); 

/* window.onload = async function() {
   
} */

async function getCardByID(cardId){
    let cardInfo = await requestCardInfo(cardId);
    document.getElementById("cardName").innerHTML = cardInfo.crd_name;
    document.getElementById("cardType").innerHTML = cardInfo.tp_name;
    document.getElementById("cardCost").innerHTML = cardInfo.crd_cost;
    document.getElementById("cardAttack").innerHTML = cardInfo.crd_atk;
}