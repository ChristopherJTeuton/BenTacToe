const cells = document.querySelectorAll('.cell');
const status = document.querySelector('.status');
const player1Wins = document.getElementById('player1Wins');
const player2Wins = document.getElementById('player2Wins');
const resetButton = document.getElementById('resetButton');
const boardElement = document.querySelector('.board');
const soloModeButton = document.getElementById('soloModeButton');
const twoPlayerModeButton = document.getElementById('twoPlayerModeButton');
const modeSelection = document.querySelector('.mode-selection');
const gameContainer = document.querySelector('.game-container');
const returnToMenuButton = document.getElementById('returnToMenuButton');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let player1Score = 0;
let player2Score = 0;
let gameCount = 0;
let gameMode = '';

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || checkWinner()) return;

    updateCell(cell, index);
    if (gameMode === 'solo' && currentPlayer === 'O') {
        setTimeout(aiMove, 2000); // 2-second delay for AI move
    }
    checkWinner();
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? 'darkgreen' : 'orange';
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer === 'X' ? 1 : 2}'s Turn`;
}

function checkWinner() {
    let winner = null;

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
            highlightWinningLine(combo);
        }
    }

    if (winner) {
        if (winner === 'X') {
            player1Score++;
        } else {
            player2Score++;
        }
        gameCount++;
        updateScoreboard();
        if (player1Score >= 3 || player2Score >= 3) {
            declareWinner();
        } else {
            setTimeout(resetBoard, 2000);
        }
    } else if (!board.includes('')) {
        gameCount++;
        setTimeout(resetBoard, 2000);
    }
}

function highlightWinningLine(combo) {
    const line = document.createElement('div');
    line.classList.add('winning-line');
    boardElement.appendChild(line);

    const [a, b, c] = combo;
    const cellA = cells[a].getBoundingClientRect();
    const cellB = cells[b].getBoundingClientRect();
    const cellC = cells[c].getBoundingClientRect();

    // Calculate the midpoint of the line
    const midX = (cellA.left + cellC.left) / 2 + 104; // Adjust this value to shift the line horizontally
    const midY = (cellA.top + cellC.top) / 2 + 104; // Adjust this value to shift the line vertically

    // Calculate the angle of the line
    const angle = Math.atan2(cellC.top - cellA.top, cellC.left - cellA.left) * (180 / Math.PI);

    // Calculate the length of the line
    const lineWidth = Math.hypot(cellC.left - cellA.left, cellC.top - cellA.top) + cellA.width;
    const lineHeight = 20; // Thickness of the line

    // Set the style of the line
    line.style.width = `${lineWidth}px`;
    line.style.height = `${lineHeight}px`;
    line.style.transform = `translate(${midX - boardElement.getBoundingClientRect().left - lineWidth / 2}px, ${midY - boardElement.getBoundingClientRect().top - lineHeight / 2}px) rotate(${angle}deg)`;
}

function updateScoreboard() {
    player1Wins.textContent = player1Score;
    player2Wins.textContent = player2Score;
}

function declareWinner() {
    if (player1Score >= 3) {
        status.textContent = 'Player 1 wins the match!';
    } else {
        status.textContent = 'Player 2 wins the match!';
    }
    resetButton.style.display = 'block';
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = ''; // Reset color
    });
    currentPlayer = 'X';
    status.textContent = `Player ${currentPlayer === 'X' ? 1 : 2}'s Turn`;
    const winningLine = document.querySelector('.winning-line');
    if (winningLine) {
        winningLine.remove();
    }
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    gameCount = 0;
    updateScoreboard();
    resetBoard();
    resetButton.style.display = 'none';
}

function aiMove() {
    let emptyCells = [];
    board.forEach((cell, index) => {
        if (cell === '') {
            emptyCells.push(index);
        }
    });

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = cells[randomIndex];
    updateCell(cell, randomIndex);
    checkWinner();
}

function startGame(mode) {
    gameMode = mode;
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    resetGame();
}

function returnToMenu() {
    modeSelection.style.display = 'block';
    gameContainer.style.display = 'none';
}

soloModeButton.addEventListener('click', () => startGame('solo'));
twoPlayerModeButton.addEventListener('click', () => startGame('2-player'));
returnToMenuButton.addEventListener('click', returnToMenu);

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
resetButton.style.display = 'none';