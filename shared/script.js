
document.querySelectorAll('.redirect-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        switch (index) {
            case 0:
                window.location.href = '/TicTacToe/tic-tac-toe.html';
                break;
            case 1:
                window.location.href = '/RockPaperScissors/rock-paper-scissors.html';
                break; 
            case 2:
                window.location.href = '/FlipCoinToss/flip-coin-toss.html';
                break;
            case 3:
                window.location.href = '/Sudoku/sudoku.html';
                break;
            case 4:
                window.location.href = '/SnakeGame/snake.html';
                break;
            case 5:
                window.location.href = '/TypingTest/typing.html';
                break;
            case 6:
                window.location.href = '/2048/twoThousandFourtyEight.html';
                break;
            case 7:
                window.location.href = '/DotAndBoxes/dot-and-boxes.html';
                break;
            case 8:
                window.location.href = '/Ludo/ludo.html';
                break;
        }
    });
});

