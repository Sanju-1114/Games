class DotsAndBoxes {
    constructor() {
        this.gridSize = 4; // 4x4 grid of boxes
        this.currentPlayer = 1;
        this.isComputerMode = false;
        this.scores = { player1: 0, player2: 0 };
        this.gameBoard = null;
        this.lines = [];
        this.boxes = [];
        this.gameOver = false;

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createGameBoard();
        this.updateUI();
    }

    setupEventListeners() {
        document.getElementById('twoPlayerBtn').addEventListener('click', () => this.setGameMode(false));
        document.getElementById('computerBtn').addEventListener('click', () => this.setGameMode(true));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
    }

    setGameMode(computerMode) {
        this.isComputerMode = computerMode;

        // Update UI
        document.getElementById('twoPlayerBtn').classList.toggle('active', !computerMode);
        document.getElementById('computerBtn').classList.toggle('active', computerMode);

        // Update player names
        document.getElementById('player2Name').textContent = computerMode ? 'Computer' : 'Player 2';

        this.resetGame();
    }

    createGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        // Calculate grid template
        const cols = this.gridSize * 2 + 1;
        const rows = this.gridSize * 2 + 1;
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, auto)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, auto)`;

        // Initialize data structures
        this.lines = [];
        this.boxes = [];

        // Create the grid
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const element = document.createElement('div');

                if (row % 2 === 0 && col % 2 === 0) {
                    // Dot
                    element.className = 'dot';
                } else if (row % 2 === 0 && col % 2 === 1) {
                    // Horizontal line
                    element.className = 'line horizontal';
                    element.dataset.type = 'horizontal';
                    element.dataset.row = Math.floor(row / 2);
                    element.dataset.col = Math.floor(col / 2);
                    element.addEventListener('click', () => this.handleLineClick(element));
                    this.lines.push(element);
                } else if (row % 2 === 1 && col % 2 === 0) {
                    // Vertical line
                    element.className = 'line vertical';
                    element.dataset.type = 'vertical';
                    element.dataset.row = Math.floor(row / 2);
                    element.dataset.col = Math.floor(col / 2);
                    element.addEventListener('click', () => this.handleLineClick(element));
                    this.lines.push(element);
                } else {
                    // Box
                    element.className = 'box';
                    element.dataset.row = Math.floor(row / 2);
                    element.dataset.col = Math.floor(col / 2);
                    this.boxes.push(element);
                }

                gameBoard.appendChild(element);
            }
        }
    }

    handleLineClick(lineElement) {
        if (this.gameOver || lineElement.classList.contains('drawn')) {
            return;
        }

        this.drawLine(lineElement);
        const completedBoxes = this.checkCompletedBoxes();

        if (completedBoxes.length > 0) {
            this.scores[`player${this.currentPlayer}`] += completedBoxes.length;
            // Player gets another turn when completing boxes
        } else {
            this.switchPlayer();
        }

        this.updateUI();

        if (this.checkGameEnd()) {
            this.endGame();
            return;
        }

        // Computer move
        if (this.isComputerMode && this.currentPlayer === 2) {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    drawLine(lineElement) {
        lineElement.classList.add('drawn', `player${this.currentPlayer}`);
    }

    checkCompletedBoxes() {
        const completedBoxes = [];

        this.boxes.forEach(box => {
            if (!box.classList.contains('completed')) {
                const row = parseInt(box.dataset.row);
                const col = parseInt(box.dataset.col);

                // Check if all four sides are drawn
                const top = this.getLine('horizontal', row, col);
                const bottom = this.getLine('horizontal', row + 1, col);
                const left = this.getLine('vertical', row, col);
                const right = this.getLine('vertical', row, col + 1);

                if (top && bottom && left && right &&
                    top.classList.contains('drawn') &&
                    bottom.classList.contains('drawn') &&
                    left.classList.contains('drawn') &&
                    right.classList.contains('drawn')) {

                    box.classList.add('completed', `player${this.currentPlayer}`);
                    box.textContent = this.currentPlayer;
                    completedBoxes.push(box);
                }
            }
        });

        return completedBoxes;
    }

    getLine(type, row, col) {
        return this.lines.find(line => 
            line.dataset.type === type &&
            parseInt(line.dataset.row) === row &&
            parseInt(line.dataset.col) === col
        );
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    makeComputerMove() {
        if (this.gameOver) return;

        const availableLines = this.lines.filter(line => !line.classList.contains('drawn'));

        if (availableLines.length === 0) return;

        // Strategy: First try to complete a box, then try to avoid giving opponent a box
        let bestMove = null;

        // 1. Look for moves that complete a box
        for (let line of availableLines) {
            const tempCompleted = this.simulateMove(line);
            if (tempCompleted > 0) {
                bestMove = line;
                break;
            }
        }

        // 2. If no completing move, avoid moves that give opponent a box
        if (!bestMove) {
            const safeMoves = availableLines.filter(line => {
                return this.countBoxesOneAwayFromCompletion(line) === 0;
            });

            if (safeMoves.length > 0) {
                bestMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
            } else {
                // 3. If all moves give opponent a box, pick randomly
                bestMove = availableLines[Math.floor(Math.random() * availableLines.length)];
            }
        }

        if (bestMove) {
            this.handleLineClick(bestMove);
        }
    }

    simulateMove(line) {
        // Temporarily draw the line and check completed boxes
        line.classList.add('drawn');
        const completedCount = this.checkCompletedBoxes().length;
        line.classList.remove('drawn');

        // Remove completed state from boxes (simulation cleanup)
        this.boxes.forEach(box => {
            if (box.classList.contains('completed') && box.textContent === '') {
                box.classList.remove('completed', 'player1', 'player2');
                box.textContent = '';
            }
        });

        return completedCount;
    }

    countBoxesOneAwayFromCompletion(line) {
        let count = 0;

        this.boxes.forEach(box => {
            if (!box.classList.contains('completed')) {
                const row = parseInt(box.dataset.row);
                const col = parseInt(box.dataset.col);

                const lines = [
                    this.getLine('horizontal', row, col),
                    this.getLine('horizontal', row + 1, col),
                    this.getLine('vertical', row, col),
                    this.getLine('vertical', row, col + 1)
                ];

                const drawnLines = lines.filter(l => l && l.classList.contains('drawn')).length;
                if (drawnLines === 3) {
                    count++;
                }
            }
        });

        return count;
    }

    updateUI() {
        document.getElementById('player1Score').textContent = this.scores.player1;
        document.getElementById('player2Score').textContent = this.scores.player2;

        const playerName = this.isComputerMode && this.currentPlayer === 2 ? 'Computer' : `Player ${this.currentPlayer}`;
        document.getElementById('currentPlayerText').textContent = `${playerName}'s Turn`;
    }

    checkGameEnd() {
        const totalBoxes = this.gridSize * this.gridSize;
        const completedBoxes = this.scores.player1 + this.scores.player2;
        return completedBoxes === totalBoxes;
    }

    endGame() {
        this.gameOver = true;

        let winnerText;
        if (this.scores.player1 > this.scores.player2) {
            winnerText = 'Player 1 Wins!';
        } else if (this.scores.player2 > this.scores.player1) {
            if (this.isComputerMode) {
                winnerText = 'Computer Wins!';
            } else {
                winnerText = 'Player 2 Wins!';
            }
        } else {
            winnerText = "It's a Tie!";
        }

        document.getElementById('winnerText').textContent = winnerText;
        document.getElementById('gameOver').style.display = 'flex';
    }

    resetGame() {
        this.currentPlayer = 1;
        this.scores = { player1: 0, player2: 0 };
        this.gameOver = false;

        document.getElementById('gameOver').style.display = 'none';

        this.createGameBoard();
        this.updateUI();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DotsAndBoxes();
});