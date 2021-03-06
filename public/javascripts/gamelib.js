var playerId;
var scoreBoard;
var gameOver;
var cardBack;
var mana;
var manaBorder;

var attackButton = new Button("Attack", 900, 450, attack);
var playButton = new Button("Play card", 1000, 450, play);
var endTurnButton = new Button("End turn", 1200, 450, end);
var killButton = new Button("Kill player", 1000, 500, killPlayer);
var buttons = [ attackButton, playButton, endTurnButton, killButton ];


var startingTurn = false;

const CARDSPACE = 150;

var deck = [];
const DECKX = 1000
const DECKY = 560

var hand = [];
const HANDX = 300;
const HANDY = 770;

var board = [];
const BOARDX = 400;
const BOARDY = 500;

var discard = [];
const DISCARDX = 100;
const DISCARDY = 560;

var playerHealth = [];
const HEATLHX = 10;
const HEATLHY = 700

var opDeck = [];
const OPDECKX = 1000;
const OPDECKY = 210;

var opHand = [];
const OPHANDX = 300;
const OPHANDY = 1;

var opBoard = [];
const OPBOARDX = 400;
const OPBOARDY = 250;

var opDiscard = [];
const OPDISCARDX = 100;
const OPDISCARDY = 210;

var opHealth = [];
const OPHEALTHX = 10;
const OPHEALTHY = 50;

async function refresh() {
        hand = [];

        board = [];

        discard = [];

        opHand = [];

        opBoard = []; 

        opDiscard = [];

        await loadScoreBoard();
        await loadCards();
        setCardsState();
        refreshButtons();        
}

async function play() {
    let card = returnSelected(hand);
    let res = await requestPlay(playerId,playerMatchId,card.getId());
    alert(res.msg);
    await loadScoreBoard();
    await loadCards();
    setCardsState();
    refreshButtons();
    location.reload();
}


async function attack() {
    let card = returnSelected(board);
    let ocard = returnSelected(opBoard);
    await requestAttack(playerId,playerMatchId,card.getId(),ocard.getId());
    await loadCards();
    setCardsState();
    refreshButtons();
    location.reload();
}

async function attackPlayer() {
    let card = returnSelected(board);
    await requestAttackPlayer(playerId,playerMatchId,card.getId());
    await loadCards();
    await loadScoreBoard();
    setCardsState();
    refreshButtons();
    location.reload();
    
}

async function end() {
    await requestEndTurn(playerId,playerMatchId);
    await loadCards();
    await loadScoreBoard();
    setCardsState();
    refreshButtons();
    await endGame(playerId);
    location.reload();
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
    let cards = await requestCardsInfo();
    for (let card of cards){
        Card.images[card.crd_id] = await loadImage(card.crd_img);
    }
    cardBack = loadImage('assets/back.png');
    mana = loadImage('assets/mana.png');
    manaBorder = loadImage('assets/manaBorder.png');
    bgMusic = loadSound('assets/Space.mp3')
    await loadScoreBoard();
    await loadCards()
    setCardsState();
    refreshButtons();
    
    image(manaBorder, 1300, 500)
    image(mana, 1350, 515);
    
    setInterval(refresh, 5000);
    loop();
}

function refreshButtons() {
    for(let button of buttons) {
        button.hide();
        button.disable();
    }
    if (scoreBoard.getPlayerState() === "Setup") {
        let countAlive = 0;
        for(let card of board) 
        if (card.getHp() > 0) countAlive++;
        if (countAlive < 3) {
            playButton.show();
            if (returnSelected(hand)) playButton.enable();
        }
        endTurnButton.show();
        endTurnButton.enable();

        killButton.show();
        killButton.enable();
    } else if (scoreBoard.getPlayerState() === "Battle") {
        attackButton.show();
        endTurnButton.show();
        endTurnButton.enable();

        killButton.show();
        killButton.enable();
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

async function setCardsState() {
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
            hand.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, HANDX + CARDSPACE * handPos, HANDY, false));
            handPos++;
        } else if(card.st_name === "Deck") {
            deck.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, DECKX, DECKY, false));
        }else if(card.st_name === "Board") {
            board.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, BOARDX + CARDSPACE * boardPos, BOARDY, false));
            boardPos++
        }else if(card.st_name === "Life"){
            playerHealth.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, HEATLHX, HEATLHY, false));
        }else{
            discard.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, DISCARDX, DISCARDY, false));
        }
    }
    for (let card of opCards) {
        if (card.st_name === "Hand"){
            opHand.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPHANDX + CARDSPACE * opHandPos, OPHANDY, true));
            opHandPos++;
        }else if (card.st_name === "Board"){
            opBoard.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPBOARDX + CARDSPACE * opBoardPos, OPBOARDY, false));
            opBoardPos++;
        }else if (card.st_name === "Deck"){
            opDeck.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPDECKX, OPDECKY, true));
            
        }else if (card.st_name === "Life"){ 
            opHealth.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.crd_hp, card.crd_cost, card.st_name, false, OPHEALTHX, OPHEALTHY, true));
           
        }else {
            opDiscard.push(new Card(card.dk_id, card.dk_crd_id, card.crd_name, card.crd_atk, card.crd_stk, card.dk_crd_hp, card.crd_cost, card.st_name, false, OPDISCARDX, OPDISCARDY, true));
        }
    }
}

function draw() {
    scoreBoard.draw();
    line(0, (windowHeight / 2), windowWidth, (windowHeight / 2));
//  -------------- player side -----------------    
    for (let card of deck) {
        card.draw();
        
    }    
    for (let card of board) {card.draw()};
    for (let card of hand) {card.draw()};
    for (let card of discard) {
        card.draw()
        image(cardBack, DISCARDX + 61, DISCARDY + 102, 120, 200);
    };
    for (let card of playerHealth) {card.draw()};

//  -------------- opponent side ---------------    
    for (let card of opHand){
        let opHandPos = 0;
        card.draw();
        image(cardBack, OPHANDX + 61 + CARDSPACE * opHandPos, OPHANDY + 102, 120, 200);
        opHandPos++;
    } 
    for (let card of opDeck){
        card.draw();
        image(cardBack, OPDECKX + 61, OPDECKY + 102, 120, 200);
    } 
    for (let card of opBoard) {card.draw()};
    for (let card of opDiscard) {
        card.draw()
        image(cardBack, OPDISCARDX + 61, OPDISCARDY + 102, 120, 200);
    };
    for (let card of opHealth) {card.draw()};

// ---------------- buttons --------------------    
    for (let button of buttons){
        button.draw();
    } 
// --------------------------------------------------
    image(cardBack, DECKX + 61, DECKY + 102, 120, 200);
  
    
}

function mouseClicked() {
    let card;
   
    card = returnSelected(board);
    if (card) {
        if (card.clicked(mouseX, mouseY)) 
            for (let card of opponent) card.deselect();    
    } else for (let card of board) card.clicked(mouseX, mouseY);
    
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

function mouseHovered(){
    let card;

    card = returnHovered(board);
    if (card) card.hover(mouseX, mouseY);
    else for (let card of board) card.hover(mouseX, mouseY);
    
    card = returnHovered(hand);
    if (card) card.hover(mouseX, mouseY);
    else for (let card of hand) card.hover(mouseX, mouseY);
    
    card = returnHovered(opBoard);
    if (card) card.hover(mouseX, mouseY);
    else for (let card of opBoard) card.hover(mouseX, mouseY);
}

function returnSelected(cardList) {
    for(let card of cardList) {
        if (card.isSelected()) return card;
    }
    return null;
}

function returnHovered(cardList){
    for(let card of cardList) {
        if (card.isHovered()) return card;
    }
    return null;
}

async function endGame(){
    try {
        let res = await requestPlayerMatchInfo(playerMatchId);
        if (gameOver == true){
            if (res.mtc_winner == playerId){
                alert("You won!");
            }else{
                alert("You lost!");
            }
            window.location = "lobby.html";
        }
    } catch (err) {
        console.log(err);
    }
}

async function killPlayer(){
    let res = await requestKillPlayer(playerMatchId);
    alert(res.msg);
}