const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Dimensiones y posiciones del arco
const goalWidth = 400;
const goalHeight = 100;
const goalX = (canvas.width - goalWidth) / 2;
const goalY = 50;

// Cargar imágenes
const playerImage = new Image();
const goalieImage = new Image();
const ballImage = new Image();
const backgroundImage = new Image(); // Imagen de fondo

playerImage.src = 'img/cr7.png'; // Ruta de la imagen del tirador
goalieImage.src = 'img/gk.png'; // Ruta de la imagen del arquero
ballImage.src = 'img/ball.png'; // Ruta de la imagen de la pelota
backgroundImage.src = 'img/background.png'; // Ruta del fondo

// Verificar carga de imágenes
let imagesLoaded = 0;
const totalImages = 4; // Número total de imágenes

function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame(); // Inicia el juego solo cuando todas las imágenes se han cargado
    }
}

function onImageError() {
    console.error('Error loading one or more images.');
}

playerImage.onload = onImageLoad;
goalieImage.onload = onImageLoad;
ballImage.onload = onImageLoad;
backgroundImage.onload = onImageLoad;

playerImage.onerror = onImageError;
goalieImage.onerror = onImageError;
ballImage.onerror = onImageError;
backgroundImage.onerror = onImageError;

// Propiedades del tirador
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 100,
    height: 100,
    speed: 5,
    shotDirection: null,
    isShooting: false
};

// Propiedades de la pelota
const ball = {
    x: player.x,
    y: player.y,
    radius: 10,
    color: 'white',
    dx: 0,
    dy: 0
};

// Propiedades del arquero
const goalie = {
    x: goalX + goalWidth / 2,
    y: goalY + goalHeight,
    width: 100,
    height: 100,
    speed: 3,
    direction: 1
};

let shotsTaken = 0;
let goalsScored = 0;
let startTime = Date.now();

function drawBackground() {
    if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
        // Ajustar el tamaño de la imagen al tamaño del canvas
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        console.error('Background image not loaded.');
    }
}

function drawField() {
    context.fillStyle = 'white';
    context.fillRect(goalX, goalY, goalWidth, 5);
    context.fillRect(goalX, goalY + goalHeight, goalWidth, 5);
    context.fillRect(goalX, goalY, 5, goalHeight);
    context.fillRect(goalX + goalWidth - 5, goalY, 5, goalHeight);
}

function drawPlayer() {
    if (playerImage.complete && playerImage.naturalWidth !== 0) {
        context.drawImage(
            playerImage,
            player.x - player.width / 2,
            player.y - player.height / 2,
            player.width,
            player.height
        );
    } else {
        console.error('Player image not loaded.');
    }
}

function drawBall() {
    if (ballImage.complete && ballImage.naturalWidth !== 0) {
        context.drawImage(
            ballImage,
            ball.x - ball.radius,
            ball.y - ball.radius,
            ball.radius * 2,
            ball.radius * 2
        );
    } else {
        console.error('Ball image not loaded.');
    }
}

function drawGoalie() {
    if (goalieImage.complete && goalieImage.naturalWidth !== 0) {
        context.drawImage(
            goalieImage,
            goalie.x - goalie.width / 2,
            goalie.y - goalie.height / 2,
            goalie.width,
            goalie.height
        );
    } else {
        console.error('Goalie image not loaded.');
    }
}

function moveGoalie() {
    if (goalie.x + goalie.width / 2 >= goalX + goalWidth || goalie.x - goalie.width / 2 <= goalX) {
        goalie.direction *= -1;
    }
    goalie.x += goalie.speed * goalie.direction;
}

function shootBall() {
    if (player.shotDirection && !player.isShooting) {
        player.isShooting = true;
        ball.x = player.x;
        ball.y = player.y;
        
        switch(player.shotDirection) {
            case 'left':
                ball.dx = -3;
                ball.dy = -4;
                break;
            case 'right':
                ball.dx = 3;
                ball.dy = -4;
                break;
            case 'center':
                ball.dx = 0;
                ball.dy = -5;
                break;
        }
    }

    if (player.isShooting) {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y < goalY + goalHeight && ball.x > goalX && ball.x < goalX + goalWidth) {
            if (ball.x > goalie.x - goalie.width / 2 && ball.x < goalie.x + goalie.width / 2) {
                player.isShooting = false;
                shotsTaken++;
                resetPlayer();
            } else if (ball.y <= goalY + goalHeight) {
                goalsScored++;
                shotsTaken++;
                increaseDifficulty();
                player.isShooting = false;
                resetPlayer();
            }
        } else if (ball.y < 0 || ball.x < 0 || ball.x > canvas.width) {
            player.isShooting = false;
            shotsTaken++;
            resetPlayer();
        }
    }
}

function resetPlayer() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    player.shotDirection = null;
    ball.dx = 0;
    ball.dy = 0;
}

function drawScore() {
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.fillText(`Goles: ${goalsScored}`, 20, 30);
    context.fillText(`Tiros: ${shotsTaken}`, canvas.width - 120, 30);
}

function drawTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.fillText(`Tiempo: ${elapsedTime}s`, canvas.width - 120, 60);
}

function increaseDifficulty() {
    goalie.speed += 0.5;
}

function updateGame() {
    drawBackground(); // Llamar a la función para dibujar el fondo
    drawField();
    drawPlayer();
    drawBall();
    drawGoalie();
    moveGoalie();
    shootBall();
    drawScore();
    drawTimer();
}

function startGame() {
    setInterval(updateGame, 1000 / 60);
}

document.getElementById('startButton').addEventListener('click', startGame);

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        player.shotDirection = 'left';
    } else if (event.key === 'ArrowRight') {
        player.shotDirection = 'right';
    } else if (event.key === 'ArrowUp') {
        player.shotDirection = 'center';
    }
});
