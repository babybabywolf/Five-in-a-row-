//constants

const PLAYER_1 = 1;
const PLAYER_2 = 2;
TIE = 0;
const COLOUR = {
  [PLAYER_1]: "black",
  [PLAYER_2]: "White",
  [null]: "#CD853F",
};

const boardContainer = document.getElementById("board-container");
const restartButton = document.getElementById("restart");

//state variable

let board;
let currentPlayer;
let winner;

defaultBoard();
initialise();

/*----- event listeners -----*/
//event listener for on click of the intersection to place a piece:
//check for valid moves (if intersection is empty)
//check for win
//update the game board
//toggle currentplayer

boardContainer.addEventListener("click", handleClick);

//event listener for on clikc of play again to reset or start a new game
restartButton.addEventListener("click", handleRestartgame);


/*----- functions -----*/
function handleRestartgame() {
  window.location.reload();
}

function handleClick(event) {
  if (winner !== null) {
    alert("Game over, please restart the game");
  } else {
    if (event.target.classList.contains("dot")) {
      const rowIndex = parseInt(event.target.dataset.row);
      const colIndex = parseInt(event.target.dataset.col);
      if (board[rowIndex][colIndex] === null) {
        board[rowIndex][colIndex] = currentPlayer;
        checkWin(rowIndex, colIndex);
        currentPlayer = currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      }
    }
    render();
  }
}



function checkWin(row, col) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for ([x, y] of directions) {
    let count = 1;
    for (let direction = -1; direction <= 1; direction += 2) {
      //check both directions, for example up and down, left and right
      for (let i = 1; i < 5; i++) {
        const newRow = row + direction * i * x;
        const newCol = col + direction * i * y;

        // Check if the new position is within the board boundaries
        if (
          newRow < 0 ||
          newRow >= 15 || // a 15x15 board
          newCol < 0 ||
          newCol >= 15 ||
          board[newRow][newCol] !== currentPlayer
        ) {
          break;
        }
        count++;
      }
    }
    if (count >= 5) {
      winner = currentPlayer;

      //celebrate wins with confetti
      const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      };

      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ["star"],
        });

        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ["circle"],
        });
      }

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);

      return true; // Player has won
    }
  }
  return false; // No winning sequence found
}

function defaultBoard() {
  for (let y = 0; y < 15; y++) {
    const col = document.createElement("div");
    col.classList.add("col");
    for (let x = 0; x < 15; x++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");

      const verticalLine = document.createElement("div");
      verticalLine.classList.add("vertical-line");
      dot.appendChild(verticalLine);

      const horizontalLine = document.createElement("div");
      horizontalLine.classList.add("horizontal-line");
      dot.appendChild(horizontalLine);

      dot.dataset.row = x;
      dot.dataset.col = y;

      col.appendChild(dot);
    }
    boardContainer.appendChild(col);
  }
}

function initialise() {
  currentPlayer = PLAYER_1;
  winner = null;
  board = [];
  for (let y = 0; y < 15; y++) {
    board.push([]);

    for (let x = 0; x < 15; x++) {
      board[y].push(null);
    }
  }

  render();
}

function render() {
  renderBoard();
  renderIndicator();
}

function renderBoard() {
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot) => {
    const row = dot.dataset.row;
    const col = dot.dataset.col;
    dot.style.backgroundColor = COLOUR[board[row][col]];
    if (board[row][col] !== null) { 
      dot.style.borderRadius = "50%";

      dot.querySelector(".vertical-line").style.display = "none";

      dot.querySelector(".horizontal-line").style.display = "none";
    } else {
      dot.querySelector(".vertical-line").style.display = "block";

      dot.querySelector(".horizontal-line").style.display = "block";
    }
  });
}

//update the game board based on player moves

function renderIndicator() {
  const player1El = document.getElementById(PLAYER_1);
  const player2El = document.getElementById(PLAYER_2);

  player1El.classList.remove("current-player");
  player2El.classList.remove("current-player");

  const playerEl = document.getElementById(currentPlayer);
  playerEl.classList.add("current-player");
  if (winner !== null) {
    const winnerEl = document.getElementById(winner);
    winnerEl.classList.add("winner");
    winnerEl.innerText = `winner is player${winner}`;
  }
}
//show game messages (turn, result)
