class LudoGame {
  constructor() {
    this.players = ['red', 'blue', 'green', 'yellow'];
    this.currentPlayerIndex = 0;
    this.currentPlayer = 'red';
    this.diceValue = 0;
    this.hasRolled = false;
    this.winner = null;

    this.startPos = { red: 50, blue: 25, green: 38, yellow: 63 };
    this.safePositions = [6, 31, 44];

    this.piecePositions = {
      red: [-1, -1, -1, -1],
      blue: [-1, -1, -1, -1],
      green: [-1, -1, -1, -1],
      yellow: [-1, -1, -1, -1]
    };

    this.homeCoords = {
      red: [[90, 90], [190, 90], [90, 190], [190, 190]],
      blue: [[410, 90], [510, 90], [410, 190], [510, 190]],
      green: [[410, 410], [510, 410], [410, 510], [510, 510]],
      yellow: [[90, 410], [190, 410], [90, 510], [190, 510]]
    };

    this.pathCoords = this.generatePathCoords();
    this.init();
  }

  generatePathCoords() {
    const coords = [];

    // Positions 0-11 (left column bottom to top)
    for (let i = 0; i < 6; i++) coords.push([40 + i * 40, 280]);
    for (let i = 0; i < 6; i++) coords.push([280, 360 + i * 40]);

    // Positions 12-23 (bottom row)
    coords.push([320, 560]);
    coords.push([360, 560]);
    for (let i = 0; i < 5; i++) coords.push([360, 520 - i * 40]);
    for (let i = 0; i < 6; i++) coords.push([400 + i * 40, 360]);

    // Positions 24-37 (right column)
    coords.push([560, 320]);
    coords.push([560, 280]);
    for (let i = 0; i < 6; i++) coords.push([520 - i * 40, 280]);
    for (let i = 0; i < 6; i++) coords.push([360, 240 - i * 40]);

    // Positions 38-49 (top row)
    coords.push([320, 40]);
    coords.push([280, 40]);
    for (let i = 0; i < 6; i++) coords.push([280, 80 + i * 40]);
    for (let i = 0; i < 5; i++) coords.push([240 - i * 40, 240]);

    // Positions 50-51 (left column)
    coords.push([40, 320]);
    coords.push([80, 320]);

    return coords;
  }

  init() {
    document.getElementById('roll-btn').addEventListener('click', () => this.rollDice());
    document.getElementById('new-game').addEventListener('click', () => this.resetGame());
    document.getElementById('rules').addEventListener('click', () => this.showRules());
    document.getElementById('play-again').addEventListener('click', () => this.resetGame());

    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('modal').style.display = 'none';
    });

    document.querySelectorAll('.piece').forEach(piece => {
      piece.addEventListener('click', e => this.movePiece(e.target));
    });

    this.updateUI();
  }

  rollDice() {
    if (this.hasRolled || this.winner) return;

    const dice = document.getElementById('dice');
    const rollBtn = document.getElementById('roll-btn');

    rollBtn.disabled = true;
    dice.classList.add('rolling');

    let count = 0;
    const interval = setInterval(() => {
      this.diceValue = Math.floor(Math.random() * 6) + 1;
      document.getElementById('dice-number').textContent = this.diceValue;
      count++;

      if (count >= 10) {
        clearInterval(interval);
        dice.classList.remove('rolling');
        this.hasRolled = true;
        this.handleDiceRoll();
      }
    }, 100);
  }

  handleDiceRoll() {
    document.getElementById('dice-message').textContent = `Rolled ${this.diceValue}!`;

    const movable = this.getMovablePieces();

    if (movable.length === 0) {
      document.getElementById('dice-message').textContent = 'No moves available!';
      setTimeout(() => {
        if (this.diceValue !== 6) {
          this.nextPlayer();
        }
        this.hasRolled = false;
        rollBtn.disabled = false;
      }, 2000);
    } else {
      this.highlightMovablePieces(movable);
    }
  }

  getMovablePieces() {
    const movable = [];
    const positions = this.piecePositions[this.currentPlayer];

    for (let i = 0; i < 4; i++) {
      const pos = positions[i];

      if (pos === -1 && this.diceValue === 6) {
        movable.push(i);
      } else if (pos >= 0 && pos < 52) {
        movable.push(i);
      }
    }

    return movable;
  }

  highlightMovablePieces(movable) {
    document.querySelectorAll('.piece').forEach(p => p.classList.remove('movable'));
    movable.forEach(i => {
      const piece = document.getElementById(`${this.currentPlayer}-${i}`);
      if (piece) piece.classList.add('movable');
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async animateMove(pieceElement, startPos, steps) {
    for (let step = 1; step <= steps; step++) {
      const pos = (startPos + step) % this.pathCoords.length;
      const coords = this.pathCoords[pos];
      pieceElement.setAttribute('cx', coords[0]);
      pieceElement.setAttribute('cy', coords[1]);
      await this.sleep(300); // Adjust this for faster/slower animation
    }
  }

  async movePiece(pieceElement) {
    if (!this.hasRolled || this.winner) return;

    const player = pieceElement.dataset.player;
    const pieceIndex = parseInt(pieceElement.dataset.piece);

    if (player !== this.currentPlayer) return;
    if (!pieceElement.classList.contains('movable')) return;

    const currentPos = this.piecePositions[player][pieceIndex];
    let newPos, startPos, stepsToMove;

    if (currentPos === -1) {
      // Coming out of home
      startPos = this.startPos[player] - 1;
      stepsToMove = 1;
      newPos = this.startPos[player];
    } else {
      // Moving on the board
      startPos = currentPos;
      stepsToMove = this.diceValue;
      newPos = (currentPos + this.diceValue) % 52;
    }

    // Animate the move
    await this.animateMove(pieceElement, startPos, stepsToMove);

    // Update piece position in the game state
    this.piecePositions[player][pieceIndex] = newPos;

    // Check for capture
    this.checkCapture(newPos, player, pieceIndex);

    // Ensure piece is exactly on the target cell (fix rounding errors)
    const finalCoords = this.pathCoords[newPos];
    pieceElement.setAttribute('cx', finalCoords[0]);
    pieceElement.setAttribute('cy', finalCoords[1]);

    // Clear highlights
    document.querySelectorAll('.piece').forEach(p => p.classList.remove('movable'));

    // Check for winner
    if (this.checkWinner()) {
      this.showWinner();
      return;
    }

    // Next turn logic
    if (this.diceValue !== 6) this.nextPlayer();
    this.hasRolled = false;
    document.getElementById('roll-btn').disabled = false;
    document.getElementById('dice-message').textContent = 'Roll again!';

    this.updateStats();
  }

  checkCapture(position, currentPlayer, currentPieceIndex) {
    if (this.safePositions.includes(position)) return;

    for (const player of this.players) {
      if (player === currentPlayer) continue;

      for (let i = 0; i < 4; i++) {
        if (this.piecePositions[player][i] === position) {
          this.piecePositions[player][i] = -1;
          this.updatePiecePosition(player, i, -1);
          document.getElementById('dice-message').textContent = 'Captured opponent!';
          break;
        }
      }
    }
  }

  checkWinner() {
    const positions = this.piecePositions[this.currentPlayer];
    return positions.every(pos => pos >= 52);
  }

  showWinner() {
    const playerNames = {
      red: 'Red Player',
      blue: 'Blue Player',
      green: 'Green Player',
      yellow: 'Yellow Player'
    };

    document.getElementById('winner-text').textContent = playerNames[this.currentPlayer] + ' Wins!';
    document.getElementById('winner-modal').style.display = 'block';
  }

  showRules() {
    document.getElementById('modal').style.display = 'block';
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
    this.currentPlayer = this.players[this.currentPlayerIndex];
    this.updateUI();
  }

  updateUI() {
    const playerNames = {
      red: 'Red Player',
      blue: 'Blue Player',
      green: 'Green Player',
      yellow: 'Yellow Player'
    };

    document.getElementById('turn-text').textContent = playerNames[this.currentPlayer] + "'s Turn";

    document.querySelectorAll('.player-card').forEach(card => {
      card.classList.remove('active');
    });

    document.querySelector(`.${this.currentPlayer}-card`).classList.add('active');
  }

  updateStats() {
    this.players.forEach(player => {
      const homeCount = this.piecePositions[player].filter(pos => pos === -1).length;
      const safeCount = this.piecePositions[player].filter(pos => pos >= 52).length;

      document.getElementById(`${player}-home`).textContent = homeCount;
      document.getElementById(`${player}-safe`).textContent = safeCount;
    });
  }

  resetGame() {
    this.currentPlayerIndex = 0;
    this.currentPlayer = 'red';
    this.diceValue = 0;
    this.hasRolled = false;
    this.winner = null;

    this.players.forEach(player => {
      this.piecePositions[player] = [-1, -1, -1, -1];
      for (let i = 0; i < 4; i++) {
        this.updatePiecePosition(player, i, -1);
      }
    });

    document.getElementById('modal').style.display = 'none';
    document.getElementById('winner-modal').style.display = 'none';

    document.getElementById('dice-number').textContent = '?';
    document.getElementById('dice-message').textContent = 'Click to roll!';
    document.getElementById('roll-btn').disabled = false;

    document.querySelectorAll('.piece').forEach(p => p.classList.remove('movable'));

    this.updateUI();
    this.updateStats();
  }

  updatePiecePosition(player, pieceIndex, position) {
    const piece = document.getElementById(`${player}-${pieceIndex}`);
    if (!piece) return;

    if (position === -1) {
      const coords = this.homeCoords[player][pieceIndex];
      piece.setAttribute('cx', coords[0]);
      piece.setAttribute('cy', coords[1]);
    } else if (position >= 0 && position < this.pathCoords.length) {
      const coords = this.pathCoords[position];
      piece.setAttribute('cx', coords[0]);
      piece.setAttribute('cy', coords[1]);
    } else {
      piece.setAttribute('cx', 300);
      piece.setAttribute('cy', 300);
    }
  }
}

// Initialize the game on page load
window.addEventListener('DOMContentLoaded', () => {
  new LudoGame();
});
