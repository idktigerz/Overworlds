/* var button;
var boardMan;


function setup() {
    button = createButton('Forfeit');
    button.position(windowWidth - 50, 1);
    button.mouseClicked(leaveGame);
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game');
    boardMan = new BoardManager(width, height, 0, 0, room);
    boardMan.initBoard();
}
function draw() {
    background(220);
    line(1, 40, windowWidth, 40);
    boardMan.draw()
    
}   
function mouseClicked() {
    boardMan.click(mouseX,mouseY);     
}

function leaveGame(){
    if (confirm("Are you sure you want to forfeit?")) {
        window.location = "index.html"
    }
} */

var monsterButton1;

function setup() {
    monsterButton1 = createButton('');
    monsterButton1.position(412, 598);
    monsterButton1.mouseClicked(leaveGame);
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(windowWidth / 6, windowHeight / 6);
    
  }
  
function draw() {
    background(150);
    
    noStroke();
    fill(0);
    rect(980, 40, 780, 0);
    
    //Left-Side_Border
    
    noStroke();
    fill(255,255, 255)
    rect(20, 20, 760, 940, 10, 0, 0, 10);
    
    noStroke();
    fill(55, 100, 255);
    rect(196, 40, 584, 900)
    
    //Life Gauge
    
    noStroke();
    fill(255);
    rect(216, 60, 544, 126);
    
    //Mana Zone
    
    noStroke();
    fill(200);
    rect(640, 600, 120, 320);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(726, 890, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(674, 860, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(726, 834, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(674, 804, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(726, 778, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(674, 748, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(726, 722, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(674, 692, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(726, 666, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(674, 636, 50);
    
    //Drop Zone
    
    noStroke();
    fill(255);
    rect(216, 794, 176, 126);
    
    //Deck Zone
    
    noStroke();
    fill(255);
    rect(412, 794, 176, 126);
    
    //Spell Zone
    
    noStroke();
    fill(0, 255, 255);
    rect(216, 206, 176);
    
    //Support Zone
    
    noStroke();
    fill(0, 0, 255);
    rect(216, 402, 176);
    
    //Field Zone
    
    noStroke();
    fill(255, 0, 255);
    rect(216, 598, 176);
    
    //Monster Zones
    
    noStroke();
    fill(255, 0, 0);
    rect(412, 598, 176);
    
    noStroke();
    fill(255, 0, 0);
    rect(412, 402, 176);
    
    noStroke();
    fill(255, 0, 0);
    rect(412, 206, 176);
    
    //Right-Side_Border
    
    noStroke();
    fill(255, 255, 255)
    rect(820, 20, 760, 940, 0, 10, 10, 0);
    
    noStroke();
    fill(55, 100, 255);
    rect(820, 40, 584, 900)
    
    //Life Gauge
    
    noStroke();
    fill(255);
    rect(840, 796, 544, 126);
    
    //Mana Zone
    
    noStroke();
    fill(200);
    rect(840, 60, 120, 320);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(874, 90, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(926, 120, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(874, 146, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(926, 176, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(874, 202, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(926, 232, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(874, 258, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(926, 288, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(874, 314, 50);
    
    noFill();
    strokeWeight(2);
    stroke(255, 255, 255);
    circle(926, 344, 50);
    
    //Drop Zone
    
    noStroke();
    fill(255);
    rect(1208, 60, 176, 126);
    
    //Deck Zone
    
    noStroke();
    fill(255);
    rect(1012, 60, 176, 126);
    
    //Spell Zone
    
    noStroke();
    fill(0, 255, 255);
    rect(1208, 600, 176);
    
    //Support Zone
    
    noStroke();
    fill(0, 0, 255);
    rect(1208, 402, 176);
    
    //Field Zone
    
    noStroke();
    fill(255, 0, 255);
    rect(1208, 206, 176);
    
    //Monster Zones
    
    noStroke();
    fill(255, 0, 0);
    rect(1012, 600, 176);
    
    noStroke();
    fill(255, 0, 0);
    rect(1012, 402, 176);
    
    noStroke();
    fill(255, 0, 0);
    rect(1012, 206, 176);
  }

function mouseClicked() {
    boardMan.click(mouseX,mouseY);     
}