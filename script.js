const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let score;
let snake;
let direction;
let food;
let gameOver = false;

document.addEventListener("keydown", directionChange);

function directionChange(event) {
    if (gameOver) {
        gameOver = false;
        startGame();
        return;
    }

    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

let game;
function startGame() {
    clearInterval(game);
    score = 0;
    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    direction = "";
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };

    let difficulty = document.getElementById("difficulty").value;
    let speed;
    switch (difficulty) {
        case '1': speed = 200; break;  // Easy
        case '2': speed = 150; break;  // Normal
        case '3': speed = 100; break;  // Hard
        case '4': speed = 70; break;   // Expert
        case '5': speed = 50; break;   // Insane
    }
    game = setInterval(draw, speed);
}

document.getElementById("startBtn").addEventListener("click", startGame);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#0f0" : "#fff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "#182848";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameOver = true;
        setTimeout(() => {
            const language = localStorage.getItem('language') || 'en';
            alert(`${locales[language].gameOver}${score}`);
        }, 100);  // 0.1 sgs delay to avoid visual bug
    }

    snake.unshift(newHead);
}

document.addEventListener("DOMContentLoaded", () => {
    loadLanguage();
});

function changeLanguage() {
    const language = document.getElementById("language").value;
    localStorage.setItem('language', language);
    loadLanguage();
}

function loadLanguage() {
    const language = localStorage.getItem('language') || 'en';
    const locale = locales[language];

    document.getElementById("title").textContent = locale.title;
    document.getElementById("chooseDifficulty").textContent = locale.chooseDifficulty;
    document.getElementById("startBtn").textContent = locale.startGame;

    const difficultyOptions = document.getElementById("difficulty").options;
    difficultyOptions[0].textContent = locale.easy;
    difficultyOptions[1].textContent = locale.normal;
    difficultyOptions[2].textContent = locale.hard;
    difficultyOptions[3].textContent = locale.expert;
    difficultyOptions[4].textContent = locale.insane;
}
