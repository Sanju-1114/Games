const boardElement = document.getElementById("board");
const numberSelector = document.getElementById("number-selector");
const resetButton = document.getElementById("reset-button");
const newGameButton = document.getElementById("newgame-button");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const stopButton = document.getElementById("stop-button");
const solveButton = document.getElementById("solve-button");
const timerDisplay = document.getElementById("timer");

let selectedNumber = null;
let board = [];
let solution = [];
let initialBoard = [];
let timer;
let seconds = 0;
let isRunning = false;

// Generate a complete Sudoku board
function generateFullBoard() {
    let base = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];
    base = shuffleRows(base, 0, 2);
    base = shuffleRows(base, 3, 5);
    base = shuffleRows(base, 6, 8);
    return base;
}

// Shuffle rows within a 3-row block
function shuffleRows(matrix, start, end) {
    let temp = matrix.slice(start, end + 1);
    temp.sort(() => Math.random() - 0.5);
    return [...matrix.slice(0, start), ...temp, ...matrix.slice(end + 1)];
}

// Generate a playable Sudoku board with missing numbers
function generateSudokuBoard() {
    let fullBoard = generateFullBoard();
    let puzzleBoard = removeNumbers(fullBoard, 40);
    solution = fullBoard; // Store the correct solution
    return puzzleBoard;
}

// Remove numbers to create a puzzle
function removeNumbers(board, count) {
    let newBoard = board.map(row => [...row]);
    let removed = 0;
    while (removed < count) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (newBoard[row][col] !== null) {
            newBoard[row][col] = null;
            removed++;
        }
    }
    return newBoard;
}

// Create Sudoku board UI
function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (num) {
                cell.textContent = num;
                cell.classList.add("fixed");
            } else {
                cell.addEventListener("click", () => {
                    if (selectedNumber !== null) {
                        cell.textContent = selectedNumber;
                        board[rowIndex][colIndex] = selectedNumber;
                    }
                });
            }
            boardElement.appendChild(cell);
        });
    });
}

// Create number selector UI
function createNumberSelector() {
    numberSelector.innerHTML = "";
    for (let i = 1; i <= 9; i++) {
        const number = document.createElement("div");
        number.classList.add("number");
        number.textContent = i;
        number.addEventListener("click", () => {
            selectedNumber = i;
        });
        numberSelector.appendChild(number);
    }
}

// Timer functions
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

function resumeTimer() {
    if (!isRunning) {
        startTimer();
    }
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    let secs = (seconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `Time: ${mins}:${secs}`;
}

// Solve Sudoku
function solveSudoku() {
    board = solution.map(row => [...row]);
    createBoard();
    stopTimer();
}

// Button Listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resumeButton.addEventListener("click", resumeTimer);
stopButton.addEventListener("click", stopTimer);
solveButton.addEventListener("click", solveSudoku);
resetButton.addEventListener("click", () => {
    board = JSON.parse(JSON.stringify(initialBoard));
    createBoard();
});
newGameButton.addEventListener("click", () => {
    board = generateSudokuBoard();
    initialBoard = JSON.parse(JSON.stringify(board));
    stopTimer();
    createBoard();
});

// Initialize game
board = generateSudokuBoard();
solution = generateFullBoard();
initialBoard = JSON.parse(JSON.stringify(board));
createBoard();
createNumberSelector();


const submitButton = document.getElementById("submit-button");

// Modify the function to create the board with disabled cells initially
function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (num) {
                cell.textContent = num;
                cell.classList.add("fixed");
            } else {
                cell.addEventListener("click", () => {
                    if (selectedNumber !== null && isGameStarted) {
                        cell.textContent = selectedNumber;
                        board[rowIndex][colIndex] = selectedNumber;
                    }
                });
                // Disable cells initially
                cell.classList.add("disabled");
            }
            boardElement.appendChild(cell);
        });
    });
}

// Add the functionality for the "Start" button to enable cells
startButton.addEventListener("click", () => {
    isGameStarted = true;
    // Enable cells after the game starts
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('disabled'));
    startTimer();
});

// Add functionality for the "Submit" button to check the board
submitButton.addEventListener("click", () => {
    let isCorrect = true;
    board.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = boardElement.children[rowIndex * 9 + colIndex];
            if (num !== solution[rowIndex][colIndex]) {
                isCorrect = false;
                cell.style.backgroundColor = "red"; // Highlight incorrect cells
            } else {
                cell.style.backgroundColor = "#fff"; // Reset correct cells
            }
        });
    });

    // Display a message depending on whether the solution is correct or not
    if (isCorrect) {
        alert("Congratulations! You've solved the Sudoku!");
    } else {
        alert("Some cells are incorrect. Keep trying!");
    }
});

// Initialize the game state and board
let isGameStarted = false; // Flag to check if the game has started
board = generateSudokuBoard();
solution = generateFullBoard();
initialBoard = JSON.parse(JSON.stringify(board));
createBoard();
createNumberSelector();
