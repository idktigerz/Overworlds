let myleaderboard;

let leader_board =[];

async function setup() {


    let canvas = createCanvas(185,200);
    leader_board = await requestAllMatchesWin();

    canvas.position(outerWidth/2.3, outerHeight/2.5);

}


function draw() {
    background(31,27,27);
    let x = 10;
    let y = 10;    


    for  (let i = 0; i < leader_board.length; i++) {

            rect(x,y+10,165,35);
            text("Name:", x+10, y+30   );
            text(leader_board[i].usr_name,x+45,y+30);
            text("Wins:", x+110, y+30   );
            text(leader_board[i].count,x+140,y+30);
            y += 40

    }
}
