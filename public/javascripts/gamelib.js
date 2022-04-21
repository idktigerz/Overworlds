var button;
var boardMan;

function setup() {
    button = createButton('Forfeit');
    button.position(100, 15);
    button.mouseClicked(leaveGame);
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game');
    boardMan = new BoardManager(width,height,0,0,room);
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
}
