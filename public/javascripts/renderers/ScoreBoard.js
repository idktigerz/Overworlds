const WIDTH = 300;
const HEIGHT = 100;
const POSX = 1300;
const POSY = 10;

class ScoreBoard {
    constructor(playerName, opponentName,playerHP, opponentHP, playerMana, opponentMana, playerState, opponentState, matchTurn, hasPlayed, opHasPlayed) {
        this.pName = playerName;
        this.oName = opponentName;
        this.pHP = playerHP;
        this.oHP = opponentHP;
        this.pMana = playerMana;
        this.oMana = opponentMana;        
        this.pState = playerState;
        this.oState = opponentState;
        this.mTurn = matchTurn;
        this.hasPlayed = hasPlayed;
        this.opHasPlayed = opHasPlayed; 
    }

    getPlayerState() {
        return this.pState;
    }
    getOpponentState() {
        return this.pState;
    }

    getPlayerHasPlayed(){

    }
    
    draw() {
        fill(100,200,100);
        stroke(0,0,0);
        rect (POSX,POSY,WIDTH,HEIGHT,5,5,5,5);
        fill(0,0,0);
        textAlign(LEFT,CENTER);
        text("Player: "+this.pName,POSX+10,POSY+HEIGHT/3);
        text("Opponent: "+this.oName,POSX+10,POSY+2*HEIGHT/3);
        text("HP: "+this.pHP,POSX+110,POSY+HEIGHT/3);
        text("HP: "+this.oHP,POSX+110,POSY+2*HEIGHT/3);
        text("MANA: "+this.pMana,POSX+170,POSY+HEIGHT/3);
        text("MANA: "+this.oMana,POSX+170,POSY+2*HEIGHT/3);
        text(`(${this.pState})`,POSX+220,POSY+HEIGHT/3);
        text(`(${this.oState})`,POSX+220,POSY+2*HEIGHT/3);
        text("Turn: " + this.mTurn, POSX + 10, POSY + 2 * HEIGHT/2.2);
  
    }

    updateScore(playerHP, opponentHP, playerMana, opponentMana, playerState, opponentState, matchTurn, hasPlayed, opHasPlayed) {
        this.pHP = playerHP;
        this.oHP = opponentHP;
        this.pMana = playerMana;
        this.oMana = opponentMana; 
        this.pState = playerState;
        this.oState = opponentState;
        this.mTurn = matchTurn;   
        this.hasPlayed = hasPlayed;
        this.opHasPlayed = opHasPlayed;        
    }
}