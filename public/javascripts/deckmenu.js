/* const { load } = require("debug/src/browser");
 IDK i think this created itself the one on top*/
<<<<<<< HEAD
var table = []

async function setup() {
    let canvas = createCanvas(585,515);
    let cards = await requestCardsInfo();
    for (let card of cards){
        card = await loadImage(card.crd_img);
        image(card, 10, 10, 10, 10);
    }
=======
let mydeck;

let deck_table =[];

/* let Deckimages =[]

 */
async function setup() {


    let canvas = createCanvas(585,515);
    deck_table = await requestCardsInfo();
/*     Deckimages[deck_table.crd_id] = await load(deck_table.crd_img)
 */
>>>>>>> 6f4f7f0ebdfa75c2759eb1ad6d5f659399f8dd7c

    canvas.position(outerWidth/4.8- 30, outerHeight/3-135);

}


function draw() {
    background(31,27,27);
<<<<<<< HEAD
=======
    
    let x = 0;
    let y = 0;    


    for  (let i = 0; i < deck_table.length; i++) {
        
            rect(x,y+10+([i]*22),615,635);
            textSize(22);
            text("ATK:", x+10, y+35+([i]*22)   );
            text(deck_table[i].crd_atk,x+80,y+35+([i]*22) );
            text("STK:", x+180, y+35 +([i]*22)   );
            text(deck_table[i].crd_stk,x+250,y+35+([i]*22) );
            text("HP:", x+410, y+35+([i]*22)   );
            text(deck_table[i].crd_hp,x+480,y+35+([i]*22) );
            /* Name */
            text(deck_table[i].crd_name,x+250,y+35+([i]*22) );
            /* Img */
            image(deck_table[i].crd_img,x+250, y+35+([i]*22));
            y += 40

    }
>>>>>>> 6f4f7f0ebdfa75c2759eb1ad6d5f659399f8dd7c
}
