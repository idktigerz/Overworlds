var playValues=[];

class BoardManager {
    
    constructor(width, height, x, y, board) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.board = board;
    }
    static async preloadImages() {
        let cardImgs = {}
        let cards = await getCards();
        for (let card of cards) {
            let playValues = card.crd_name;
            playValues.push(playValue);
        }
    } 
    async initBoard() {
        let board = await getRoom(this.board);
        this.board = new Board(this.width, this.height, this.x, this.y, playValues);   
    }
    draw() { 
        if (this.board) this.board.draw(); 
    }
    async refresh () {
        let room = await getRoom(this.room);
        this.board.setMatchCard(room.crd_id);
    }
    async play(value) {
        let result = await play(this.match, value);
        this.board.setResult(result.victory);
        this.board.setMatchCard(result.current_topcard);
    }
    async click(x,y) {
        if (this.board.matchCardClicked(x,y)) {
            this.refresh();
        } else {
            let value = this.board.valueClicked(x,y);
            if (value) this.play(value);
        }
    }
}