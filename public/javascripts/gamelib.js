var playerId;
var scoreBoard;
var gameOver;

var attackButton = new Button("Attack", 900, 350, attack);
var playButton = new Button("Play card", 1000, 350, play);
var endTurnButton = new Button("End turn", 1200, 350, end);
var buttons = [ attackButton, playButton, endTurnButton ];


var startingTurn = false;

const CARDSPACE = 150;

var deck = [];
const DECKX = 1000
const DECKY = 600

var hand = [];
const HANDX = 300;
const HANDY = 770;

var board = [];
const BOARDX = 400;
const BOARDY = 450;

var discard = [];
const DISCARDX = 200;
const DISCARDY = 600;

var playerHealth = [];
const HEATLHX = 10;
const HEATLHY = 700

var opDeck = [];
const OPDECKX = 1000;
const OPDECKY = 150;

var opHand = [];
const OPHANDX = 300;
const OPHANDY = 1;

var opBoard = [];
const OPBOARDX = 400;
const OPBOARDY = 250;

var opDiscard = [];
const OPDISCARDX = 200;
const OPDISCARDY = 50;

var opHealth = [];
const OPHEALTHX = 10;
const OPHEALTHY = 50;

async function refresh() {
        
    deck = [];

    hand = [];

    board = [];

    discard = [];

    playerHealth = [];

    opDeck = [];

    opHand = [];

    opBoard = []; 

    opDiscard = [];

    opHealth = [];

 

    if (scoreBoard && 
        (scoreBoard.getPlayerState() == "Setup" ||
        scoreBoard.getPlayerState() == "Battle")) {
            await loadScoreBoard();
            await loadCards();
            setCardsState();
            startingTurn = true;        
    } else {
        if (startingTurn) {
            await loadScoreBoard();
            await loadCards();
            setCardsState();
            refreshButtons();
            startingTurn = false;            
        }
    }
    await endGame(playerId);
}

async function play() {
    let card = returnSelected(hand);
    let res = await requestPlay(playerId,playerMatchId,card.getId());
    alert(res.msg);
    await loadScoreBoard();
    await loadCards();
    setCardsState();
    refreshButtons();
    refresh();
    location.reload();
}


async function attack() {
    let card = returnSelected(board);
    let ocard = returnSelected(opBoard);
    await requestAttack(playerId,playerMatchId,card.getId(),ocard.getId());
    await loadCards();
    setCardsState();
    refreshButtons();
    refresh();
    //location.reload();
}

async function attackPlayer() {
    let card = returnSelected(board);
    await requestAttackPlayer(playerId,playerMatchId,card.getId());
    await loadCards();
    await loadScoreBoard();
    setCardsState();
    refreshButtons();
    refresh();
    //location.reload();
    
}

async function end() {
    await requestEndTurn(playerId,playerMatchId);
    await loadCards();
    await loadScoreBoard();
    setCardsState();
    refreshButtons();
    await endGame(playerId);
    refresh();
    //location.reload();
} 

async function loadScoreBoard() {
    let p1 = await requestPlayerMatchInfo(playerMatchId);
    let p2 = await requestPlayerMatchInfo(opponentMatchId);
    playerId = p1.usr_id;
    gameOver = p1.mtc_finished;
    scoreBoard = new ScoreBoard(p1.usr_name, p2.usr_name, p1.pm_hp, p2.pm_hp, p1.pm_mana, p2.pm_mana, p1.pms_name, p2.pms_name, p1.mtc_turn, p1.pm_played, p2.pm_played);
}

function preload() {

}

async function setup() {
    noLoop();
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game');
    await loadScoreBoard();
    await loadCards()
    setCardsState();
    refreshButtons();
    //setInterval(refresh, 5000);
    loop();
}

function refreshButtons() {
    for(let button of buttons) {
        button.hide();
        button.disable();
    }
    if (scoreBoard.getPlayerState() === "Draw"){
        getCardsButton.show();
        getCardsButton.enable();
        endTurnButton.show();
        endTurnButton.enable();
    }
    else if (scoreBoard.getPlayerState() === "Setup") {
        playButton.show();
        let countAlive = 0;
        for(let card of board) 
        if (card.getHp() > 0) countAlive++;
        if (countAlive < 3) {
            if (returnSelected(hand)) playButton.enable();
        }
        endTurnButton.show();
        endTurnButton.enable();
    } else if (scoreBoard.getPlayerState() === "Battle") {
        attackButton.show();
        endTurnButton.show();
        endTurnButton.enable();
        let countAlive = 0;
        for(let card of opBoard) 
        if (card.getHp() > 0) countAlive++;
        if (countAlive == 0) {
            attackButton.setNewFunc(attackPlayer,"Attack Player");
            if (returnSelected(board)) attackButton.enable();
        } else {
            attackButton.setNewFunc(attack,"Attack");
            if (returnSelected(board) && returnSelected(opBoard)) 
                attackButton.enable();      
        }
    }
}

function setCardsState() {
    for (let card of hand) card.disable();
    for (let card of deck) card.disable()
    for (let card of board) card.disable();
    for (let card of discard) card.disable();
    for (let card of playerHealth) card.disable();
    for (let card of opHand) card.disable();
    for (let card of opHealth) card.disable();
    for (let card of opDeck) card.disable();
    for (let card of opBoard) card.disable();
    for (let card of opDiscard) card.disable();

    if (scoreBoard.getPlayerState() === "Draw"){
        for (let card of deck) card.enable();
    }else if (scoreBoard.getPlayerState() === "Setup") {
        for (let card of hand) card.enable();
    } else if (scoreBoard.getPlayerState() === "Battle") {
        for (let card of board) 
           if (!card.hasAttacked()){
                card.enable();
           } 
        for (let card of opBoard) card.enable();
        if (returnSelected(board)) {
            for (let card of opBoard) 
                if (card.getHp() > 0) card.enable();
        }
    }   
}



async function loadCards() {
    let myCards = await requestPlayerMatchDeck(playerId, playerMatchId);
    let opCards = await requestPlayerMatchDeck(playerId, opponentMatchId);

    deck = [];

    let handPos = 0;
    hand = [];

    let boardPos = 0;
    board = [];

    discard = [];

    playerHealth = [];

    opDeck = [];

    let opHandPos = 0;
    opHand = [];

    let opBoardPos = 0;
    opBoard = []; 

    opDiscard = [];

    opHealth = [];

    for (let card of myCards) {
        if (card.st_name === "Hand") {
            hand.push(new Card(card.dk_id,card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, HANDX + CARDSPACE * handPos, HANDY, false));
            handPos++;
        } else if(card.st_name === "Deck") {
            deck.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, DECKX, DECKY, false));
        }else if(card.st_name === "Board") {
            board.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, BOARDX + CARDSPACE * boardPos, BOARDY, false));
            boardPos++
        }else if(card.st_name === "Life"){
            playerHealth.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, HEATLHX, HEATLHY, false));
        }else{
            discard.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, DISCARDX, DISCARDY, false));
        }
    }
    for (let card of opCards) {
        if (card.st_name === "Hand"){
            opHand.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPHANDX + CARDSPACE * opHandPos, OPHANDY, true));
            opHandPos++;
        }else if (card.st_name === "Board"){
            opBoard.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPBOARDX + CARDSPACE * opBoardPos, OPBOARDY, false));
            opBoardPos++;
        }else if (card.st_name === "Deck"){
            opDeck.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPDECKX, OPDECKY, true));
        }else if (card.st_name === "Life"){ 
            opHealth.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.crd_hp, card.crd_cost, card.st_name, false, OPHEALTHX, OPHEALTHY, true));
           
        }else {
            opDiscard.push(new Card(card.dk_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPDISCARDX, OPDISCARDY, true));
        }
    }
}

function draw() {
    noStroke();
    scoreBoard.draw();
//  -------------- player side -----------------    
    for (let card of deck) card.draw();
    for (let card of board) card.draw();
    for (let card of hand) card.draw();
    for (let card of discard) card.draw();
    for (let card of playerHealth) card.draw();

//  -------------- opponent side ---------------    
    for (let card of opHand) card.draw();
    for (let card of opDeck) card.draw();
    for (let card of opBoard) card.draw();
    for (let card of opDiscard) card.draw();
    for (let card of opHealth) card.draw();

// ---------------- buttons --------------------    
    for (let button of buttons) button.draw();

}

function mouseClicked() {
    let card;
    
    card = returnSelected(deck);
    if (card) card.clicked(mouseX, mouseY)
    else for (let card of deck) card.clicked(mouseX, mouseY);

    card = returnSelected(board);
    if (card) card.clicked(mouseX, mouseY);
    else for (let card of board) card.clicked(mouseX, mouseY);
    
    card = returnSelected(hand);
    if (card) card.clicked(mouseX, mouseY);
    else for (let card of hand) card.clicked(mouseX, mouseY);
    
    card = returnSelected(opBoard);
    if (card) card.clicked(mouseX, mouseY);
    else for (let card of opBoard) card.clicked(mouseX, mouseY);

    setCardsState();
    refreshButtons();
    for (let button of buttons) button.clicked(mouseX,mouseY);
}

function returnSelected(cardList) {
    for(let card of cardList) {
        if (card.isSelected()) return card;
    }
    return null;
}

async function endGame(playerId){
    try {
        let res = await requestPlayerMatchInfo(playerId);
        console.log(playerId);
        if (gameOver == true){
            if (res.mtc_winner == playerId){
                alert("You won!");
                window.location = "matches.html";
            }else{
                alert("You lost!");
                window.location = "matches.html";
            }
            
        }
    } catch (err) {
        console.log(err);
    }
}
