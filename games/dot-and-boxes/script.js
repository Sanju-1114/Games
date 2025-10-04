const GRID_SIZE = 5;
        const DOT_SPACING = 80;
        let currentPlayer = 1;
        let scores = [0, 0];
        let gameMode = '2player';
        let lines = {
            horizontal: [],
            vertical: []
        };
        let boxes = [];
        let gameOver = false;

        function initGame() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';
            board.style.position = 'relative';
            board.style.width = (GRID_SIZE - 1) * DOT_SPACING + 'px';
            board.style.height = (GRID_SIZE - 1) * DOT_SPACING + 'px';

            lines.horizontal = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE - 1).fill(0));
            lines.vertical = Array(GRID_SIZE - 1).fill(null).map(() => Array(GRID_SIZE).fill(0));
            boxes = Array(GRID_SIZE - 1).fill(null).map(() => Array(GRID_SIZE - 1).fill(0));

            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.style.left = j * DOT_SPACING + 'px';
                    dot.style.top = i * DOT_SPACING + 'px';
                    board.appendChild(dot);
                }
            }

            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE - 1; j++) {
                    const line = document.createElement('div');
                    line.className = 'line horizontal';
                    line.style.left = j * DOT_SPACING + 'px';
                    line.style.top = i * DOT_SPACING + 'px';
                    line.dataset.row = i;
                    line.dataset.col = j;
                    line.dataset.type = 'horizontal';
                    line.onclick = () => handleLineClick(i, j, 'horizontal');
                    board.appendChild(line);
                }
            }

            for (let i = 0; i < GRID_SIZE - 1; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    const line = document.createElement('div');
                    line.className = 'line vertical';
                    line.style.left = j * DOT_SPACING + 'px';
                    line.style.top = i * DOT_SPACING + 'px';
                    line.dataset.row = i;
                    line.dataset.col = j;
                    line.dataset.type = 'vertical';
                    line.onclick = () => handleLineClick(i, j, 'vertical');
                    board.appendChild(line);
                }
            }

            for (let i = 0; i < GRID_SIZE - 1; i++) {
                for (let j = 0; j < GRID_SIZE - 1; j++) {
                    const box = document.createElement('div');
                    box.className = 'box';
                    box.style.left = j * DOT_SPACING + 'px';
                    box.style.top = i * DOT_SPACING + 'px';
                    box.id = `box-${i}-${j}`;
                    board.appendChild(box);
                }
            }

            currentPlayer = 1;
            scores = [0, 0];
            gameOver = false;
            updateDisplay();
        }

        function handleLineClick(row, col, type) {
            if (gameOver) return;
            
            const lineArray = type === 'horizontal' ? lines.horizontal : lines.vertical;
            
            if (lineArray[row][col] !== 0) return;

            lineArray[row][col] = currentPlayer;
            
            const lineElement = document.querySelector(
                `.line.${type}[data-row="${row}"][data-col="${col}"]`
            );
            lineElement.classList.add('filled');
            lineElement.classList.add(`player${currentPlayer}`);

            const completedBoxes = checkCompletedBoxes(row, col, type);
            
            if (completedBoxes.length > 0) {
                scores[currentPlayer - 1] += completedBoxes.length;
                completedBoxes.forEach(([boxRow, boxCol]) => {
                    const boxElement = document.getElementById(`box-${boxRow}-${boxCol}`);
                    boxElement.classList.add('completing');
                    setTimeout(() => {
                        boxElement.classList.remove('completing');
                        boxElement.classList.add(`completed-p${currentPlayer}`);
                        boxElement.innerHTML = `
                            ${currentPlayer === 1 ? '⭐' : '💎'}
                            <span class="box-count">${currentPlayer}</span>
                        `;
                    }, 100);
                });
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }

            updateDisplay();
            checkGameOver();

            if (!gameOver && gameMode === 'computer' && currentPlayer === 2) {
                setTimeout(computerMove, 600);
            }
        }

        function checkCompletedBoxes(row, col, type) {
            const completed = [];

            if (type === 'horizontal') {
                if (row > 0 && isBoxComplete(row - 1, col)) {
                    boxes[row - 1][col] = currentPlayer;
                    completed.push([row - 1, col]);
                }
                if (row < GRID_SIZE - 1 && isBoxComplete(row, col)) {
                    boxes[row][col] = currentPlayer;
                    completed.push([row, col]);
                }
            } else {
                if (col > 0 && isBoxComplete(row, col - 1)) {
                    boxes[row][col - 1] = currentPlayer;
                    completed.push([row, col - 1]);
                }
                if (col < GRID_SIZE - 1 && isBoxComplete(row, col)) {
                    boxes[row][col] = currentPlayer;
                    completed.push([row, col]);
                }
            }

            return completed;
        }

        function isBoxComplete(row, col) {
            return boxes[row][col] === 0 &&
                   lines.horizontal[row][col] !== 0 &&
                   lines.horizontal[row + 1][col] !== 0 &&
                   lines.vertical[row][col] !== 0 &&
                   lines.vertical[row][col + 1] !== 0;
        }

        function computerMove() {
            if (gameOver) return;

            const availableMoves = [];
            
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE - 1; j++) {
                    if (lines.horizontal[i][j] === 0) {
                        availableMoves.push({row: i, col: j, type: 'horizontal'});
                    }
                }
            }

            for (let i = 0; i < GRID_SIZE - 1; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (lines.vertical[i][j] === 0) {
                        availableMoves.push({row: i, col: j, type: 'vertical'});
                    }
                }
            }

            if (availableMoves.length === 0) return;

            let bestMove = null;

            for (const move of availableMoves) {
                const boxesCompleted = simulateMove(move.row, move.col, move.type);
                if (boxesCompleted > 0) {
                    bestMove = move;
                    break;
                }
            }

            if (!bestMove) {
                const safeMoves = availableMoves.filter(move => {
                    return !wouldGiveOpponentBox(move.row, move.col, move.type);
                });

                if (safeMoves.length > 0) {
                    bestMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
                } else {
                    bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
            }

            handleLineClick(bestMove.row, bestMove.col, bestMove.type);
        }

        function simulateMove(row, col, type) {
            let count = 0;
            if (type === 'horizontal') {
                if (row > 0 && countBoxLines(row - 1, col) === 3) count++;
                if (row < GRID_SIZE - 1 && countBoxLines(row, col) === 3) count++;
            } else {
                if (col > 0 && countBoxLines(row, col - 1) === 3) count++;
                if (col < GRID_SIZE - 1 && countBoxLines(row, col) === 3) count++;
            }
            return count;
        }

        function wouldGiveOpponentBox(row, col, type) {
            let willGive = false;
            if (type === 'horizontal') {
                if (row > 0 && countBoxLines(row - 1, col) === 2) willGive = true;
                if (row < GRID_SIZE - 1 && countBoxLines(row, col) === 2) willGive = true;
            } else {
                if (col > 0 && countBoxLines(row, col - 1) === 2) willGive = true;
                if (col < GRID_SIZE - 1 && countBoxLines(row, col) === 2) willGive = true;
            }
            return willGive;
        }

        function countBoxLines(row, col) {
            let count = 0;
            if (lines.horizontal[row][col] !== 0) count++;
            if (lines.horizontal[row + 1][col] !== 0) count++;
            if (lines.vertical[row][col] !== 0) count++;
            if (lines.vertical[row][col + 1] !== 0) count++;
            return count;
        }

        function updateDisplay() {
            document.getElementById('score1').textContent = scores[0];
            document.getElementById('score2').textContent = scores[1];
            
            document.getElementById('player1Info').classList.toggle('active', currentPlayer === 1);
            document.getElementById('player2Info').classList.toggle('active', currentPlayer === 2);

            const turnText = gameMode === 'computer' && currentPlayer === 2 
                ? "🤖 Computer's Turn..." 
                : `Player ${currentPlayer}'s Turn`;
            document.getElementById('turnIndicator').textContent = turnText;

            const totalBoxes = (GRID_SIZE - 1) * (GRID_SIZE - 1);
            const p1Percent = (scores[0] / totalBoxes) * 100;
            const p2Percent = (scores[1] / totalBoxes) * 100;
            
            document.getElementById('progress1').style.width = p1Percent + '%';
            document.getElementById('progress1').textContent = scores[0] > 0 ? scores[0] : '';
            document.getElementById('progress2').style.width = p2Percent + '%';
            document.getElementById('progress2').textContent = scores[1] > 0 ? scores[1] : '';
        }

        function checkGameOver() {
            const totalBoxes = (GRID_SIZE - 1) * (GRID_SIZE - 1);
            if (scores[0] + scores[1] === totalBoxes) {
                gameOver = true;
                const msg = document.getElementById('winnerMessage');
                if (scores[0] > scores[1]) {
                    msg.textContent = '🎉 Player 1 Wins! 🎉';
                    msg.style.color = '#667eea';
                } else if (scores[1] > scores[0]) {
                    const winnerName = gameMode === 'computer' ? 'Computer' : 'Player 2';
                    msg.textContent = `🎉 ${winnerName} Wins! 🎉`;
                    msg.style.color = '#764ba2';
                } else {
                    msg.textContent = '🤝 It\'s a Tie! 🤝';
                    msg.style.color = '#ff6b6b';
                }
            }
        }

        function setMode(mode) {
            gameMode = mode;
            const buttons = document.querySelectorAll('.mode-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            document.getElementById('player2Name').textContent = 
                mode === 'computer' ? 'Computer' : 'Player 2';
            
            resetGame();
        }

        function resetGame() {
            document.getElementById('winnerMessage').textContent = '';
            initGame();
        }

        initGame();