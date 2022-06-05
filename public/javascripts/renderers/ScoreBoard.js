const WIDTH = 300;
const HEIGHT = 100;
const POSX = 1300;
const POSY = 500;

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
        return this.oState;
    }
    
    draw() {
        textAlign(LEFT,CENTER);
        text(this.pMana, POSX + 170, POSY + HEIGHT / 3);
        text(`${this.pState}`, POSX + 220,POSY + HEIGHT / 3);
        textSize(14);
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