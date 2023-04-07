/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

function colorsInputForm() {
  const gameBoard = document.getElementById("game");

  const colorsInputForm = document.createElement("form");
  const inputPlayer1 = document.createElement("input");
  inputPlayer1.type = "text";
  inputPlayer1.name = "inputPlayer1";
  inputPlayer1.placeholder = "Enter Player 1 Color";

  const inputPlayer2 = document.createElement("input");
  inputPlayer2.type = "text";
  inputPlayer2.name = "inputPlayer2";
  inputPlayer2.placeholder = "Enter Player 2 Color";

  const startButton = document.createElement("input");
  startButton.type = "submit";
  startButton.name = "start"
  startButton.value = "Start";


  colorsInputForm.append(inputPlayer1);
  colorsInputForm.append(inputPlayer2);
  colorsInputForm.append(startButton);
  colorsInputForm.addEventListener("submit", startAndRestartGame)
  gameBoard.append(colorsInputForm);
}

function startAndRestartGame(evt) {
  evt.preventDefault();
  const colorsInputForm = evt.target;
  const player1Color = colorsInputForm.elements["inputPlayer1"].value;
  const player2Color = colorsInputForm.elements["inputPlayer2"].value;
  const startButton = colorsInputForm.elements["start"]

  //create a new instance of Game with default args
  if (![...startButton.classList].includes('started')) {
    new Game(6, 7, [player1Color, player2Color]);
    startButton.classList.add('started');
    startButton.value = "Restart";
  } else {
    const board = document.getElementById("board");
    board.innerHTML = "";
    new Game(6, 7, [player1Color, player2Color]);
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(width, height, playerColors) {
    // initialize properties
    this.width = width;
    this.height = height;
    this.currPlayer = null;
    this.board = [];
    this.players = [];

    // bind methods
    this.boundHandleClick = this.handleClick.bind(this);

    // create board model and render
    this.makeBoard();
    this.makeHtmlBoard();
    // invoke setup players
    this.setupPlayers(playerColors);
  }

  //methods

  // setup players
    // get colors
    // construct players, add to players array
    // alter bg-color for p1 and p2
  setupPlayers(playerColors) {
    for (let color of playerColors) {
      this.players.push(new Player(color));
    }
    this.currPlayer = this.players[0];
  }

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
    top.addEventListener("click", this.boundHandleClick);

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
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.background = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    // freeze game
    const topRow = document.getElementById("column-top");
    topRow.removeEventListener("click", this.boundHandleClick)
  }

  handleClick(evt) {
    // grab instance properties
    let board = this.board;
    let currPlayer = this.currPlayer;
    let players = this.players;

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
      return this.endGame(`The ${currPlayer.color} player won! Please click Restart to play another game!`);
    }

    // check for tie
    if (board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie! Please click Restart to play another game!");
    }

    // go to next player
    this.currPlayer = players[players.indexOf(currPlayer) + 1] || players[0];
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

colorsInputForm();
