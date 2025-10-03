document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const bestDisplay = document.getElementById('best');
    const resultDisplay = document.getElementById('result');
    const restartBtn = document.getElementById('restart-btn');
    
    let squares = [];
    const width = 4;
    let score = 0;
    let best = localStorage.getItem('2048-best') || 0;

    bestDisplay.innerHTML = best;

    // Initialize the game
    function createBoard() {
        gridDisplay.innerHTML = '';
        squares = [];
        
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.classList.add('tile');
            square.innerHTML = '';
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        
        generate();
        generate();
        updateColors();
    }

    // Generate a new number (2 or 4) in a random empty square
    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == '') {
            squares[randomNumber].innerHTML = Math.random() > 0.1 ? 2 : 4;
            checkForGameOver();
        } else {
            generate();
        }
    }

    // Move tiles right
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;
                let row = [parseInt(totalOne) || 0, parseInt(totalTwo) || 0, parseInt(totalThree) || 0, parseInt(totalFour) || 0];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = zeros.concat(filteredRow);

                squares[i].innerHTML = newRow[0] || '';
                squares[i + 1].innerHTML = newRow[1] || '';
                squares[i + 2].innerHTML = newRow[2] || '';
                squares[i + 3].innerHTML = newRow[3] || '';
            }
        }
    }

    // Move tiles left
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;
                let row = [parseInt(totalOne) || 0, parseInt(totalTwo) || 0, parseInt(totalThree) || 0, parseInt(totalFour) || 0];

                let filteredRow = row.filter(num => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = filteredRow.concat(zeros);

                squares[i].innerHTML = newRow[0] || '';
                squares[i + 1].innerHTML = newRow[1] || '';
                squares[i + 2].innerHTML = newRow[2] || '';
                squares[i + 3].innerHTML = newRow[3] || '';
            }
        }
    }

    // Move tiles up
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + width].innerHTML;
            let totalThree = squares[i + (width * 2)].innerHTML;
            let totalFour = squares[i + (width * 3)].innerHTML;
            let column = [parseInt(totalOne) || 0, parseInt(totalTwo) || 0, parseInt(totalThree) || 0, parseInt(totalFour) || 0];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros);

            squares[i].innerHTML = newColumn[0] || '';
            squares[i + width].innerHTML = newColumn[1] || '';
            squares[i + (width * 2)].innerHTML = newColumn[2] || '';
            squares[i + (width * 3)].innerHTML = newColumn[3] || '';
        }
    }

    // Move tiles down
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + width].innerHTML;
            let totalThree = squares[i + (width * 2)].innerHTML;
            let totalFour = squares[i + (width * 3)].innerHTML;
            let column = [parseInt(totalOne) || 0, parseInt(totalTwo) || 0, parseInt(totalThree) || 0, parseInt(totalFour) || 0];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn);

            squares[i].innerHTML = newColumn[0] || '';
            squares[i + width].innerHTML = newColumn[1] || '';
            squares[i + (width * 2)].innerHTML = newColumn[2] || '';
            squares[i + (width * 3)].innerHTML = newColumn[3] || '';
        }
    }

    // Combine row for horizontal movement
    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML !== '') {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = '';
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        checkForWin();
    }

    // Combine column for vertical movement
    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML && squares[i].innerHTML !== '') {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + width].innerHTML = '';
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        checkForWin();
    }

    // Control function for keyboard input
    function control(e) {
        if (e.keyCode === 37) {
            keyLeft();
        } else if (e.keyCode === 38) {
            keyUp();
        } else if (e.keyCode === 39) {
            keyRight();
        } else if (e.keyCode === 40) {
            keyDown();
        }
    }

    // Key functions
    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
        updateColors();
    }

    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
        updateColors();
    }

    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
        updateColors();
    }

    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
        updateColors();
    }

    // Check for win condition
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = 'You WIN! 🎉';
                resultDisplay.className = 'result win';
                document.removeEventListener('keyup', control);
                updateBest();
                return;
            }
        }
    }

    // Check for game over
    function checkForGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == '') {
                zeros++;
            }
        }
        
        if (zeros === 0) {
            // Check if any moves are possible
            let movePossible = false;
            
            // Check horizontal moves
            for (let i = 0; i < 16; i++) {
                if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
                    movePossible = true;
                    break;
                }
            }
            
            // Check vertical moves
            for (let i = 0; i < 12; i++) {
                if (squares[i].innerHTML === squares[i + 4].innerHTML) {
                    movePossible = true;
                    break;
                }
            }
            
            if (!movePossible) {
                resultDisplay.innerHTML = 'You LOSE! 😢 Try Again!';
                resultDisplay.className = 'result lose';
                document.removeEventListener('keyup', control);
                updateBest();
            }
        }
    }

    // Update colors based on tile values
    function updateColors() {
        for (let i = 0; i < squares.length; i++) {
            let value = squares[i].innerHTML;
            squares[i].className = 'tile';
            
            if (value === '') {
                squares[i].classList.add('tile-empty');
            } else if (value <= 2048) {
                squares[i].classList.add('tile-' + value);
            } else {
                squares[i].classList.add('tile-super');
            }
        }
    }

    // Update best score
    function updateBest() {
        if (score > best) {
            best = score;
            bestDisplay.innerHTML = best;
            localStorage.setItem('2048-best', best);
        }
    }

    // Restart game
    function restartGame() {
        updateBest();
        score = 0;
        scoreDisplay.innerHTML = 0;
        resultDisplay.innerHTML = '';
        resultDisplay.className = 'result';
        document.addEventListener('keyup', control);
        createBoard();
    }

    // Event listeners
    document.addEventListener('keyup', control);
    restartBtn.addEventListener('click', restartGame);

    // Initialize game
    createBoard();

    // Touch/swipe support for mobile
    let startX, startY;

    gridDisplay.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    gridDisplay.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;

        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;

        let diffX = startX - endX;
        let diffY = startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                keyLeft();
            } else {
                keyRight();
            }
        } else {
            if (diffY > 0) {
                keyUp();
            } else {
                keyDown();
            }
        }

        startX = null;
        startY = null;
    });
});
