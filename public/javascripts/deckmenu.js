/* const { load } = require("debug/src/browser");
 IDK i think this created itself the one on top*/
var table = []

async function setup() {
    let canvas = createCanvas(585,515);
    let cards = await requestCardsInfo();
    for (let card of cards){
        card = await loadImage(card.crd_img);
        image(card, 10, 10, 10, 10);
    }

    canvas.position(outerWidth/4.8- 30, outerHeight/3-135);

}


function draw() {
    background(31,27,27);
}
