var button;
var attackButton;
let cards = [];
let types = [];
var placeX;
var placeY;
var placeTypeX;
var cardSelected = false;


async function setup() {
    button = createButton('Forfeit');
    button.position(windowWidth - 50, 1);
    button.mouseClicked(leaveGame);
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game');

    if (cardSelected == true){
        attackBtn = createButton("Attack card");
        attackBtn.position(800, 400);
        button.mousePressed(attackCard);
    }

    let cards_array = await getAllCards()
    for (let i = 0; i < cards_array.length; i++) {
        cards.push({
            cardHealth: cards_array[i].crd_hp,
            cardCost: cards_array[i].crd_cost,
            cardStk: cards_array[i].crd_stk,
            cardAtk: cards_array[i].crd_atk,
            cardId: cards_array[i].crd_id,
            cardName: cards_array[i].crd_name,
            cardDesc: cards_array[i].crd_dsc,
            cardType: cards_array[i].crd_tp_id,
            width: 140,
            height: 220
        })
    }

    let types_array = await requestAllCardsType()
    for (let i = 0; i < types_array.length; i++) {
        types.push({
            typeName: types_array[i].tp_name
        })
    }
}
function draw() {
    background(220);

    for (let i = 0; i < types.length; i++) {
        if (cardSelected == true) {
            placeX = 300;
            placeTypeX = 300;
            placeY = 100;
            text("Type: " + types[i].typeName, placeTypeX, placeY + 20);
            placeTypeX += cards[i].width * 1.25
        }else{
            placeX = 600;
            placeTypeX = 600;
            placeY = 800;
            text("Type: " + types[i].typeName, placeTypeX, placeY + 20);
            placeTypeX += cards[i].width * 1.25
        }
       
    }
    
    for (i = 0; i < cards.length; i++){
        if (cardSelected == true) {
            placeX = 300;
            placeTypeX = 300;
            placeY = 100;
            rect(placeX, placeY, cards[i].width, cards[i].height);
                if (cards[i].cardType == 1) {
                    text("Card is played", 100, 100)
                    text(cards[i].cardName, placeX, placeY + 40)
                    text("Card attack: " + cards[i].cardAtk, placeX, placeY + 160)
                    text("Card strike: " + cards[i].cardStk, placeX, placeY + 180)
                    text("Card health: " + cards[i].cardHealth, placeX, placeY + 200)
                    text("Cost: " + cards[i].cardCost, placeX + 100, placeY + 20)
        
        
                } else if (cards[i].cardType == 2) {
                    text("Card is played", 100, 100)
                    text(cards[i].cardName, placeX, placeY + 40)
                    text("Card health: " + cards[i].cardHealth, placeX, placeY + 200)
                    text("Card attack: " + cards[i].cardAtk, placeX, placeY + 180)
                    text("Cost: " + cards[i].cardCost, placeX + 100, placeY + 20)
    
        
                } else {
                    text("Card is played", 100, 100)
                    text(cards[i].cardName, placeX, placeY + 40)
                    text("Cost: " + cards[i].cardCost, placeX + 100, placeY + 20)
                    
        
                }
                placeX += cards[i].width * 1.25
                break
                
        }else{
                
                rect(placeX, placeY, cards[i].width, cards[i].height);
                if (cards[i].cardType == 1) {
                    
                    text(cards[i].cardName, placeX, placeY + 40)
                    text("Card attack: " + cards[i].cardAtk, placeX, placeY + 160)
                    text("Card strike: " + cards[i].cardStk, placeX, placeY + 180)
                    text("Card health: " + cards[i].cardHealth, placeX, placeY + 200)
                    text("Cost: " + cards[i].cardCost, placeX + 100, placeY + 20)
        
                } else if (cards[i].cardType == 2) {
                    text(cards[i].cardName, placeX, placeY + 40)
                    text("Card health: " + cards[i].cardHealth, placeX, placeY + 200)
                    text("Card attack: " + cards[i].cardAtk, placeX, placeY + 180)
                    text("Cost: " + cards[i].cardCost, placeX + 100, placeY + 20)
        
                } else {
                    text(cards[i].cardName, placeX, placeY + 40)
                    text("Cost: " + cards[i].cardCost, placeX + 100, placeY + 20)
        
                }
        
                placeX += cards[i].width * 1.25
                
            }
    }
    placeX = 600;
    placeTypeX = 600;
    placeY = 800;
    
   
    line(1, 40, windowWidth, 40);
}

function leaveGame() {
    if (confirm("Are you sure you want to forfeit?")) {
        window.location = "index.html"
    }
}

async function mousePressed() {
    for (let i = 0; i < cards.length; i++) {
        if ((mouseX > placeX) && (mouseX < placeX + cards[i].width) & (mouseY > placeY) && (mouseY < placeY + cards[i].height)) {
            console.log("Card selected " + cards[i].cardId)
            try{
                let result = await requestCardInfo(i + 1);
                if (result) { 
                    cardSelected = true 
                    console.log(cardSelected)
                }
                break;
            }catch(err){
                console.log(err)
            }
        }
        placeX += cards[i].width * 1.25;
    }
    
}
function attackCard() {
   
}

