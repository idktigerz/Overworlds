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
            let cardValues = card.crd_name;
            cardValues.push(cardValue);
            cardImgs[cardValues] = loadImage('./assets/'+cardValue+'.png');
        }
        Card.initImgs(cardImgs);
    } 
    async initBoard() {
        let board = await getRoomById(this.board);
        this.board = new Board(this.width,this.height,this.x,this.y,
                card.crd_id, cardValues);   
    }
    draw() { 
        if (this.board) this.board.draw(); 
    }
    async refresh () {
        let card = await getCard(this.card);
        this.board.setMatchCard(card.crd_id);
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