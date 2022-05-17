const CWIDTH = 80;
const CHEIGHT = 160;

class Card {
    constructor(id, name, atk, hp, cost, state, attacked, x, y, opponent) {
        this.id=id;
        this.name = name;
        this.atk = atk;
        this.hp = hp;
        this.cost = cost;
        this.state = state;
        this.x = x;
        this.y = y;
        this.enabled = true;
        this.attacked = attacked;
        this.selected = false;
        this.opponent = opponent
    }
    draw() {
        if (this.selected) {
            fill(100, 200, 100);
        } else if (this.attacked) {
            fill(200, 100, 100)
        } else {
            fill(255, 255, 255);
        }
        strokeWeight(3);
        if (this.enabled) {
            stroke(200, 0, 0);
        } else {
            stroke(0, 0, 0);
        }
        rect(this.x, this.y, CWIDTH, CHEIGHT, 2, 2, 2, 2);
        fill(0, 0, 0);
        stroke(0, 0, 0);
        strokeWeight(1);

        if(!this.opponent){
            if (this.state === 'Hand'){
                textAlign(LEFT, TOP);
                text(this.name, this.x + 5, this.y + 25);
                textAlign(LEFT, CENTER);
                text("HP: " + this.hp, this.x + 5, this.y + 90);
                textAlign(RIGHT, TOP);
                text(this.cost, this.x + CWIDTH - 5 , this.y + 5);
                textAlign(LEFT, BOTTOM);
                text("Atk: " + this.atk, this.x + 5, this.y + CHEIGHT / 1.5);
            }else if (this.state === 'Board'){
                textAlign(LEFT, TOP);
                text(this.name, this.x + 5, this.y + 10);
                textAlign(LEFT, CENTER);
                text("HP: " + this.hp, this.x + 5, this.y + 120);
                textAlign(LEFT, BOTTOM);
                text("Atk: " + this.atk, this.x + 5, this.y + 140);
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
}