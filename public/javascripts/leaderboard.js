let myleaderboard;

let leader_board =[];

async function setup() {


    let canvas = createCanvas(285,315);
    leader_board = await requestAllMatchesWin();

    canvas.position(outerWidth/2.3- 30, outerHeight/2.5-135);

}


function draw() {
/*     background(31,27,27);
 */    let x = 0;
    let y = 0;    


    for  (let i = 0; i < leader_board.length; i++) {
        
            rect(x,y+10+([i]*22),315,35);
            textSize(22);
            text("Name:", x+10, y+35+([i]*22)   );
            text(leader_board[i].usr_name,x+80,y+35+([i]*22) );
            text("Wins:", x+180, y+35 +([i]*22)   );
            text(leader_board[i].count,x+250,y+35+([i]*22) );
            y += 40

    }
}
