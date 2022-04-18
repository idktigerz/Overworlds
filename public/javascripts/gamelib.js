var button;

function setup() {
    button = createButton('Forfeit');
    //button.position(30, 15);
    button.mouseClicked(leaveGame);
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game');
}
function draw() {
    background(220);
    line(1, 40, windowWidth, 40);
}
function mouseClicked() {
    boardMan.click(mouseX,mouseY);     
}

function leaveGame(){
    if (confirm("Are you sure you want to forfeit?")) {
        window.location = "index.html"
    }
}