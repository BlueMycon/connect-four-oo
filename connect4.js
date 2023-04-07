/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//one class - game
//inputs: width, height,

//Game
//-GameLogic
//-UILogic
function makeHtmlButton() {
  const gameBoard = document.getElementById("game");
  const startButton = document.createElement("button");
  startButton.innerText = "Start";
  startButton.addEventListener("click", startAndRestartGame);
  //attach event listener, passing in new Game as the callback
  gameBoard.append(startButton);
}

function startAndRestartGame(evt) {
  const button = evt.target;
  //create a new instance of Game with default args
  if (![...button.classList].includes('started')) {
    new Game(6, 7);
    button.classList.add('started');
    button.innerText = "Restart";
  } else {
    const board = document.getElementById("board");
    board.innerHTML = "";
    new Game(6,7);
  }
}

class Game {
  constructor(width, height) {
    // initialize properties
    this.width = width;
    this.height = height;
    this.currPlayer = 1;
    this.board = [];

    // create board model and render
    this.makeBoard();
    this.makeHtmlBoard();
  }

  //methods

  //makeHtmlButton

  //startGame

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");
    //     htmlBoard.innerHtml = '';
    // console.log('htmlBoard.innerHtml=', htmlBoard.innerHtml)
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    // freeze game
    const topRow = document.getElementById("column-top");
    console.log('topRow=',topRow);
    topRow.removeEventListener("click", this.handleClick.bind(this))
  }

  handleClick(evt) {
    // grab instance properties
    let board = this.board;
    let currPlayer = this.currPlayer;

    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${currPlayer} won!
      Please click Restart to play another game!`);
    }

    // check for tie
    if (board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie! Please click Restart to play another game!");
    }

    // switch players
    this.currPlayer = currPlayer === 1 ? 2 : 1;
  }

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// const WIDTH = 7;
// const HEIGHT = 6;

// //not sur exactly where to go
// let currPlayer = 1; // active player: 1 or 2

// //every instance of game will have a board property that starts as an empty array
// let board = []; // array of rows, each row is array of cells  (board[y][x])

// /** makeBoard: create in-JS board structure:
//  *   board = array of rows, each row is array of cells  (board[y][x])
//  */

// //method -> going to need to review for use of keyword this
// //biz logic
// function makeBoard() {
//   for (let y = 0; y < HEIGHT; y++) {
//     board.push(Array.from({ length: WIDTH }));
//   }
// }

// /** makeHtmlBoard: make HTML table and row of column tops. */

// //potentially have subclasses that handle business logic and display logic seperately
// //translated into method with this keyword, change variables referances to related class properties
// //UI Logic
// function makeHtmlBoard() {
//   const board = document.getElementById("board");

//   // make column tops (clickable area for adding a piece to that column)
//   const top = document.createElement("tr");
//   top.setAttribute("id", "column-top");
//   top.addEventListener("click", handleClick);

//   for (let x = 0; x < WIDTH; x++) {
//     const headCell = document.createElement("td");
//     headCell.setAttribute("id", x);
//     top.append(headCell);
//   }

//   board.append(top);

//   // make main part of board
//   for (let y = 0; y < HEIGHT; y++) {
//     const row = document.createElement("tr");

//     for (let x = 0; x < WIDTH; x++) {
//       const cell = document.createElement("td");
//       cell.setAttribute("id", `c-${y}-${x}`);
//       row.append(cell);
//     }

//     board.append(row);
//   }
// }

// /** findSpotForCol: given column x, return top empty y (null if filled) */

// function findSpotForCol(x) {
//   for (let y = HEIGHT - 1; y >= 0; y--) {
//     if (!board[y][x]) {
//       return y;
//     }
//   }
//   return null;
// }

// /** placeInTable: update DOM to place piece into HTML table of board */

// function placeInTable(y, x) {
//   const piece = document.createElement("div");
//   piece.classList.add("piece");
//   piece.classList.add(`p${currPlayer}`);
//   piece.style.top = -50 * (y + 2);

//   const spot = document.getElementById(`c-${y}-${x}`);
//   spot.append(piece);
// }

// /** endGame: announce game end */

// function endGame(msg) {
//   alert(msg);
// }

// /** handleClick: handle click of column top to play piece */

// function handleClick(evt) {
//   // get x from ID of clicked cell
//   const x = +evt.target.id;

//   // get next spot in column (if none, ignore click)
//   const y = findSpotForCol(x);
//   if (y === null) {
//     return;
//   }

//   // place piece in board and add to HTML table
//   board[y][x] = currPlayer;
//   placeInTable(y, x);

//   // check for win
//   if (checkForWin()) {
//     return endGame(`Player ${currPlayer} won!`);
//   }

//   // check for tie
//   if (board.every((row) => row.every((cell) => cell))) {
//     return endGame("Tie!");
//   }

//   // switch players
//   currPlayer = currPlayer === 1 ? 2 : 1;
// }

// /** checkForWin: check board cell-by-cell for "does a win start here?" */

// function checkForWin() {
//   function _win(cells) {
//     // Check four cells to see if they're all color of current player
//     //  - cells: list of four (y, x) cells
//     //  - returns true if all are legal coordinates & all match currPlayer

//     return cells.every(
//       ([y, x]) =>
//         y >= 0 &&
//         y < HEIGHT &&
//         x >= 0 &&
//         x < WIDTH &&
//         board[y][x] === currPlayer
//     );
//   }

//   for (let y = 0; y < HEIGHT; y++) {
//     for (let x = 0; x < WIDTH; x++) {
//       // get "check list" of 4 cells (starting here) for each of the different
//       // ways to win
//       const horiz = [
//         [y, x],
//         [y, x + 1],
//         [y, x + 2],
//         [y, x + 3],
//       ];
//       const vert = [
//         [y, x],
//         [y + 1, x],
//         [y + 2, x],
//         [y + 3, x],
//       ];
//       const diagDR = [
//         [y, x],
//         [y + 1, x + 1],
//         [y + 2, x + 2],
//         [y + 3, x + 3],
//       ];
//       const diagDL = [
//         [y, x],
//         [y + 1, x - 1],
//         [y + 2, x - 2],
//         [y + 3, x - 3],
//       ];

//       // find winner (only checking each win-possibility as needed)
//       if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
//         return true;
//       }
//     }
//   }
// }

// makeBoard();
// makeHtmlBoard();

// new Game(6, 7);
makeHtmlButton();
