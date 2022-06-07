const CWIDTH = 120;
const CHEIGHT = 200;


class Card {
    static images = {};
    constructor(id, card_id, name, atk, stk, hp, cost, state, attacked, x, y, opponent) {
        this.id=id;
        this.card_id = card_id;
        this.name = name;
        this.atk = atk;
        this.stk = stk;
        this.hp = hp;
        this.cost = cost;
        this.state = state;
        this.x = x;
        this.y = y;
        this.enabled = true;
        this.attacked = attacked;
        this.selected = false;
        this.hovered = false; 
        this.opponent = opponent
    }
    draw() {
        if (this.selected) {
            //fill(100, 200, 100);
            rect(1400, 100, CWIDTH * 2, CHEIGHT * 2, 2, 2, 2);
            stroke(0, 0, 0);
            strokeWeight(1);
            imageMode(CENTER)
            image(Card.images[this.card_id], 1520, 300, CWIDTH * 2, CHEIGHT * 2);
            textAlign(LEFT, CENTER);
            text(this.hp, this.x + 5, this.y + 145);
            
        } else if (this.attacked) {
            fill(200, 100, 100);
        } else {
            fill(100, 100, 100);
        }
        strokeWeight(3);
        if (this.enabled) {
            stroke(200, 0, 0);
        } else {
            stroke(0, 0, 0);
        }
        if (this.hovered){
            rect(windowWidth / 2, windowHeight / 2, CWIDTH * 2, CHEIGHT * 2, 2, 2, 2, 2);
            fill(0, 0, 0);
            stroke(0, 0, 0);
            strokeWeight(1);
        }else{
            rect(this.x, this.y, CWIDTH, CHEIGHT, 2, 2, 2, 2);
            fill(0, 0, 0);
            stroke(0, 0, 0);
            strokeWeight(1);
        }
       

        if(!this.opponent){
            if (this.state === 'Hand'){
                imageMode(CENTER)
                image(Card.images[this.card_id],this.x+CWIDTH/2, this.y+ CHEIGHT/2, CWIDTH, CHEIGHT);
                textAlign(LEFT, CENTER);
                text(this.hp, this.x + 5, this.y + 145);
        

                
            }else if (this.state === 'Board'){
                imageMode(CENTER)
                image(Card.images[this.card_id],this.x + CWIDTH/2, this.y+ CHEIGHT/2, CWIDTH ,CHEIGHT);
                text(this.hp, this.x + 10, this.y + 150);
                textAlign(LEFT, BOTTOM);
            }
        } 
    }
    getId() { return this.id;}
    
    hasAttacked() { return this.attacked; }
    setAttack(hasAttacked) { this.attacked = hasAttacked }
    
    getHp() { return this.hp; }
    setHp(hp) { this.hp = hp }
    
    enable() { this.enabled = true }
    disable() { this.enabled = false }
    
    isSelected() { return this.selected; }
    deselect() {this.selected = false;}
    
    isHovered() { return this.hovered; }

    clicked(x, y) {
        if (this.enabled) {
            if (this.x <= x && (this.x + CWIDTH) >= x &&
                this.y <= y && (this.y + CHEIGHT) >= y) {
                this.selected = !this.selected;
                return true;
            }
        }
        return false;
    }

    hover(x, y){
        if (this.enabled) {
            if (this.x <= x && (this.x + CWIDTH) >= x &&
                this.y <= y && (this.y + CHEIGHT) >= y) {
                this.hovered = !this.hovered;
                return true;
            }
        }
        return false;
    }
}