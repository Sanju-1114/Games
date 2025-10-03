const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Size of each unit in the grid
const playAgainBtn = document.getElementById("playAgain");
const scoreDisplay = document.getElementById("score");

let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let game;

// Adjust canvas size dynamically
function adjustCanvasSize() {
    let screenSize = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = Math.floor(screenSize * 0.6 / box) * box; // 80% of screen size
    canvas.height = Math.floor(screenSize * 0.6 / box) * box;
}

// Call on load and resize
adjustCanvasSize();
window.addEventListener("resize", adjustCanvasSize);

// Listen for keyboard input
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Swipe gesture controls for mobile
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

canvas.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (deltaX < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (deltaY > 0 && direction !== "UP") direction = "DOWN";
        else if (deltaY < 0 && direction !== "DOWN") direction = "UP";
    }
}

// Generate food at a random position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Draw the game elements
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food as a circle
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake as circles
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "yellow" : "lime"; // Head is yellow, body is green
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    });

    let newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "LEFT") newHead.x -= box;
    if (direction === "UP") newHead.y -= box;
    if (direction === "RIGHT") newHead.x += box;
    if (direction === "DOWN") newHead.y += box;

    // Check for collision (Game Over)
    if (
        newHead.x < 0 || newHead.x >= canvas.width ||
        newHead.y < 0 || newHead.y >= canvas.height ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        clearInterval(game);
        playAgainBtn.style.display = "block"; // Show play again button
        return;
    }

    // Eating food
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;  // Increase score
        scoreDisplay.textContent = score;  // Update UI
        food = generateFood();  // Generate new food
    } else {
        snake.pop();  // Remove tail if no food eaten
    }

    snake.unshift(newHead);
}

// Start game function
function startGame() {
    score = 0;
    scoreDisplay.textContent = score; // Reset score display
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = generateFood();
    playAgainBtn.style.display = "none"; // Hide play again button
    game = setInterval(draw, 150);
}

// Play again button event listener
playAgainBtn.addEventListener("click", startGame);

// Start the game when the page loads
startGame();


// Prevent scrolling when using arrow keys
window.addEventListener("keydown", function(event) {
  if ([37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
  }
}, { passive: false });

// Prevent touch gestures from scrolling the page
window.addEventListener("touchmove", function(event) {
  event.preventDefault();
}, { passive: false });
