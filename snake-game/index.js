
class Snake{
    constructor(head){
        this.head        = head;
        this.tail        = [];
        this.timeoutId   = null;
        this.currentMove = null;
    }
}


let snake = new Snake([10, 5]);
snake.tail.push([10, 4]) 
snake.tail.push([10, 3]) 
let fruit = [];

const moves = {
    "ArrowLeft" : ["column", -1, 0],
    "ArrowRight": ["column", 1, 0],
    "ArrowUp"   : ["row", -1, 1],
    "ArrowDown" : ["row", 1, 1],
};

// Sound effects.
const turn  = document.getElementById('turns');
const bite  = document.getElementById('bite');
const hit   = document.getElementById('hit');


// setting up the board
const arena = document.querySelector(".arena");
board = []
for(let row = 1; row <= 17; row++){
    rowcell = []
    for(let column = 1; column <= 17; column++){
        const cell = document.createElement("div");
        if (column == 1 || column == 17 || row == 1 || row == 17){
            cell.classList.add('walls');
        }
        else{
            cell.classList.add('unoccupied');
        }
        rowcell.push(cell)
        arena.appendChild(cell);
    }
    board.push(rowcell)
}

 
function newfruit(){
    r = Math.floor(Math.random() * 15) + 1;
    c = Math.floor(Math.random() * 15) + 1;
    board[r][c].classList.add('fruit');
    return [r, c];
}


// initializing the Game
function startGame(){
    let [x, y] = snake.head
    board[x][y].classList.add('head');
    for (let element of snake.tail){
        [a, b] = element;
        board[a][b].classList.add('tail');
    }
    fruit = newfruit();
}


// Game Controls
document.addEventListener('keydown', function(event){
    const validMove = function(keydown){
        let c = snake.currentMove;
        if(moves[keydown][2] != moves[c][2]){
            snake.currentMove = keydown;
            return true;
        }
        return false;
    }

    let key = event.key;
    if (event.key in moves){
        if (snake.currentMove == null){
            snake.currentMove = event.key;
            turn.play();
            // runGame(moves[key][0], moves[key][1]);
            Motion(moves[key][0], moves[key][1]);
        }
        else
        if (validMove(key)){
            turn.play();
            // runGame(moves[key][0], moves[key][1]);
            Motion(moves[key][0], moves[key][1]);
        }
    }
    
})


// some lose conditions to be added
GameOver = function(x, y){
    
    return (
        board[x][y].classList.contains('tail') ||
        (y == 0 || y == 16 || x == 0 || x == 16)
    )
}

// implementation of dynamic growth of snake not done
AteFruit = function(x, y){
    if (x === fruit[0] && y === fruit[1]){
        bite.play();
        let [a, b] = fruit;
        board[a][b].classList.remove('fruit');
        fruit = newfruit();

        return true;
    }
    return false;
}


Motion = function(axis, direction){
    let [h0, h1] = snake.head;
    // let [t0, t1] = snake.tail[0];
    
    if (GameOver(h0, h1)){
        hit.play();
        return;
    }
    
    
    if (AteFruit(h0, h1)){
        [a, b] = snake.tail[snake.tail.length -1];
        if (axis === "column"){
            snake.tail.push([a, b - direction])
            board[a][b - direction].classList.add('tail');
        }
        else{
            snake.tail.push([a - direction, b])
            board[a - direction][b].classList.add('tail');
        }
    }
    
    clearTimeout(snake.timeoutId);
    // Moving the head
    
    board[h0][h1].classList.remove('head');
    if (axis === "column"){
        // left or right
        snake.head[1] += direction;
        board[h0][h1+direction].classList.add('head');
    }
    else {
        // up or down
        snake.head[0] += direction;
        board[h0+direction][h1].classList.add('head');
    }
    

    // Moving the tail
    let updateTail = [h0, h1];
    let i = 0
    for(let element of snake.tail){
        let [x, y] = updateTail;
        let [t0, t1] = element;
        board[t0][t1].classList.remove('tail')
        snake.tail[i] = updateTail;
        board[x][y].classList.add('tail')
        updateTail = element;
        i += 1;
    }
    
    snake.timeoutId = setTimeout(() => {
        Motion(axis, direction);
    }, 200);
    
}


startGame();




