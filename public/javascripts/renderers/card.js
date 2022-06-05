const CWIDTH = 80;
const CHEIGHT = 160;


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
            fill(100, 200, 100);
            
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
                textAlign(LEFT, TOP);
                text(this.name, this.x + 5, this.y + 25);
                textAlign(LEFT, CENTER);
                text("HP: " + this.hp, this.x + 5, this.y + CHEIGHT / 1.6);
                textAlign(RIGHT, TOP);
                text(this.cost, this.x + CWIDTH - 5 , this.y + 5);
                textAlign(LEFT, BOTTOM);
                text("Atk: " + this.atk, this.x + 5, this.y + CHEIGHT / 1.3);
                text("Stk: " + this.stk, this.x + 5, this.y + CHEIGHT / 1.18);
                imageMode(CENTER)
                image(Card.images[this.card_id],this.x+CWIDTH/2, this.y+ CHEIGHT/2,CWIDTH,CHEIGHT);
                
            }else if (this.state === 'Board'){
                textAlign(LEFT, TOP);
                text(this.name, this.x + 5, this.y + 10);
                textAlign(LEFT, CENTER);
                text("HP: " + this.hp, this.x + 5, this.y + 100);
                textAlign(LEFT, BOTTOM);
                text("Atk: " + this.atk, this.x + 5, this.y + 120);
                text("Stk: " + this.stk, this.x + 5, this.y + 140);
                imageMode(CENTER)
                image(Card.images[this.card_id],this.x+CWIDTH/2, this.y+ CHEIGHT/2,CWIDTH,CHEIGHT);
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