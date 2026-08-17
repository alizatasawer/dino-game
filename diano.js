/* =========================================
   DINO RUSH — GAME ENGINE
   Desktop + Mobile Responsive Controls
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("bestScore");

const startScreen = document.getElementById("startScreen");
const gameOverBox = document.getElementById("gameOver");
const pauseScreen = document.getElementById("pauseScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const resumeBtn = document.getElementById("resumeBtn");

const jumpBtn = document.getElementById("jumpBtn");
const pauseBtn = document.getElementById("pauseBtn");

const finalScore = document.getElementById("finalScore");
const resultBest = document.getElementById("resultBest");


/* =========================================
   GAME STATE
========================================= */

let gameRunning = false;
let paused = false;

let score = 0;

let bestScore =
    Number(localStorage.getItem("dinoBest")) || 0;

let animationId = null;
let lastTime = 0;

let obstacleTimer = 0;
let cloudTimer = 0;

let gameSpeed = 6;


/* =========================================
   WORLD
========================================= */

const WORLD_WIDTH = 900;
const WORLD_HEIGHT = 300;
const GROUND_Y = 270;


/* =========================================
   DINO
========================================= */

const dino = {

    x: 80,
    y: 220,

    width: 42,
    height: 48,

    velocityY: 0,

    gravity: 0.78,

    jumpPower: -14,

    jumping: false
};


/* =========================================
   OBJECTS
========================================= */

let obstacles = [];
let clouds = [];


/* =========================================
   INITIAL SCORE
========================================= */

bestText.textContent = bestScore;
resultBest.textContent = bestScore;


/* =========================================
   CLOUD
========================================= */

function createCloud(x = WORLD_WIDTH + 40) {

    clouds.push({

        x: x,

        y:
            35 +
            Math.random() * 80,

        width:
            70 +
            Math.random() * 40,

        speed:
            0.5 +
            Math.random() * 0.5
    });
}


/* =========================================
   OBSTACLE
========================================= */

function createObstacle() {

    const tall = Math.random() > 0.72;

    obstacles.push({

        x: WORLD_WIDTH + 30,

        y: tall ? 202 : 220,

        width: tall ? 30 : 24,

        height: tall ? 68 : 48
    });
}


/* =========================================
   RESET GAME
========================================= */

function resetGame() {

    score = 0;

    gameSpeed = 6;

    obstacleTimer = 0;
    cloudTimer = 0;

    obstacles = [];
    clouds = [];

    dino.x = 80;
    dino.y = 220;

    dino.velocityY = 0;
    dino.jumping = false;

    scoreText.textContent = "0";

    createCloud();
    createCloud();
}


/* =========================================
   SKY
========================================= */

function drawSky() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            WORLD_HEIGHT
        );

    gradient.addColorStop(
        0,
        "#7dd3fc"
    );

    gradient.addColorStop(
        0.55,
        "#bae6fd"
    );

    gradient.addColorStop(
        1,
        "#e0e7ff"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* SUN */

    const sunGradient =
        ctx.createRadialGradient(
            740,
            60,
            5,
            740,
            60,
            45
        );

    sunGradient.addColorStop(
        0,
        "rgba(255,255,255,0.95)"
    );

    sunGradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    ctx.fillStyle = sunGradient;

    ctx.beginPath();

    ctx.arc(
        740,
        60,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================================
   CLOUDS
========================================= */

function drawClouds() {

    clouds.forEach(cloud => {

        ctx.fillStyle =
            "rgba(255,255,255,0.68)";

        ctx.beginPath();

        ctx.arc(
            cloud.x,
            cloud.y,
            18,
            0,
            Math.PI * 2
        );

        ctx.arc(
            cloud.x + 20,
            cloud.y - 7,
            24,
            0,
            Math.PI * 2
        );

        ctx.arc(
            cloud.x + 44,
            cloud.y,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}


/* =========================================
   GROUND
========================================= */

function drawGround() {

    ctx.fillStyle = "#334155";

    ctx.fillRect(
        0,
        GROUND_Y,
        WORLD_WIDTH,
        4
    );

    ctx.fillStyle = "#64748b";

    for (
        let x = 0;
        x < WORLD_WIDTH;
        x += 45
    ) {

        const offset =
            (score * 0.35) % 45;

        ctx.fillRect(
            x - offset,
            GROUND_Y + 10,
            22,
            2
        );
    }
}


/* =========================================
   DINO
========================================= */

function drawDino() {

    ctx.save();

    ctx.shadowColor =
        "rgba(124,58,237,0.55)";

    ctx.shadowBlur = 14;


    /* BODY */

    ctx.fillStyle = "#7c3aed";

    ctx.fillRect(
        dino.x + 5,
        dino.y + 10,
        32,
        32
    );


    /* HEAD */

    ctx.fillRect(
        dino.x + 20,
        dino.y,
        25,
        25
    );


    /* TAIL */

    ctx.fillRect(
        dino.x,
        dino.y + 22,
        12,
        7
    );


    ctx.shadowBlur = 0;


    /* EYE */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        dino.x + 35,
        dino.y + 7,
        5,
        5
    );


    /* PUPIL */

    ctx.fillStyle = "#111827";

    ctx.fillRect(
        dino.x + 37,
        dino.y + 8,
        3,
        3
    );


    /* LEGS */

    ctx.fillStyle = "#6d28d9";

    ctx.fillRect(
        dino.x + 9,
        dino.y + 40,
        7,
        9
    );

    ctx.fillRect(
        dino.x + 28,
        dino.y + 40,
        7,
        9
    );

    ctx.restore();
}


/* =========================================
   OBSTACLES
========================================= */

function drawObstacles() {

    obstacles.forEach(obstacle => {

        ctx.save();

        ctx.shadowColor =
            "rgba(16,185,129,0.35)";

        ctx.shadowBlur = 10;

        ctx.fillStyle = "#059669";


        /* TRUNK */

        ctx.fillRect(
            obstacle.x + 8,
            obstacle.y,
            10,
            obstacle.height
        );


        /* BRANCHES */

        ctx.fillRect(
            obstacle.x,
            obstacle.y + 15,
            9,
            6
        );

        ctx.fillRect(
            obstacle.x + 18,
            obstacle.y + 26,
            9,
            6
        );


        /* LEAVES */

        ctx.fillStyle = "#10b981";

        ctx.fillRect(
            obstacle.x + 5,
            obstacle.y + 7,
            6,
            7
        );

        ctx.restore();
    });
}


/* =========================================
   DRAW GAME
========================================= */

function drawGame() {

    ctx.clearRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    drawSky();
    drawClouds();
    drawGround();
    drawObstacles();
    drawDino();
}


/* =========================================
   DINO PHYSICS
========================================= */

function updateDino() {

    dino.velocityY += dino.gravity;

    dino.y += dino.velocityY;


    if (dino.y >= 220) {

        dino.y = 220;

        dino.velocityY = 0;

        dino.jumping = false;
    }
}


/* =========================================
   JUMP
========================================= */

function jump() {

    if (!gameRunning || paused) {
        return;
    }

    if (!dino.jumping) {

        dino.velocityY =
            dino.jumpPower;

        dino.jumping = true;
    }
}


/* =========================================
   UPDATE OBJECTS
========================================= */

function updateObjects(delta) {

    const movement =
        gameSpeed *
        delta *
        60;


    obstacles.forEach(obstacle => {

        obstacle.x -= movement;
    });


    clouds.forEach(cloud => {

        cloud.x -=
            cloud.speed *
            delta *
            60;
    });


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.x > -60
        );


    clouds =
        clouds.filter(
            cloud =>
                cloud.x > -120
        );
}


/* =========================================
   COLLISION
========================================= */

function checkCollision() {

    const dinoBox = {

        x: dino.x + 7,

        y: dino.y + 5,

        width: dino.width - 10,

        height: dino.height - 7
    };


    for (const obstacle of obstacles) {

        const obstacleBox = {

            x: obstacle.x + 3,

            y: obstacle.y + 3,

            width: obstacle.width - 6,

            height: obstacle.height - 3
        };


        const hit =

            dinoBox.x <
            obstacleBox.x +
            obstacleBox.width

            &&

            dinoBox.x +
            dinoBox.width >
            obstacleBox.x

            &&

            dinoBox.y <
            obstacleBox.y +
            obstacleBox.height

            &&

            dinoBox.y +
            dinoBox.height >
            obstacleBox.y;


        if (hit) {
            return true;
        }
    }

    return false;
}


/* =========================================
   DIFFICULTY
========================================= */

function updateDifficulty() {

    const displayedScore =
        Math.floor(score / 10);

    gameSpeed =
        Math.min(
            11,
            6 + displayedScore / 120
        );
}


/* =========================================
   GAME LOOP
========================================= */

function gameLoop(timestamp) {

    if (!gameRunning || paused) {
        return;
    }


    const delta =
        Math.min(
            (timestamp - lastTime) / 1000,
            0.035
        );


    lastTime = timestamp;


    updateDino();
    updateObjects(delta);


    obstacleTimer +=
        delta * 1000;

    cloudTimer +=
        delta * 1000;


    const obstacleInterval =
        Math.max(
            650,
            1350 -
            Math.floor(score / 10) * 2
        );


    if (
        obstacleTimer >=
        obstacleInterval
    ) {

        createObstacle();

        obstacleTimer = 0;
    }


    if (cloudTimer >= 1800) {

        createCloud();

        cloudTimer = 0;
    }


    if (checkCollision()) {

        endGame();

        return;
    }


    score += delta * 60;


    const displayedScore =
        Math.floor(score / 10);


    scoreText.textContent =
        displayedScore;


    updateDifficulty();

    drawGame();


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================================
   START GAME
========================================= */

function startGame() {

    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }


    resetGame();


    gameRunning = true;
    paused = false;


    startScreen.classList.add(
        "hidden"
    );

    gameOverBox.classList.add(
        "hidden"
    );

    pauseScreen.classList.add(
        "hidden"
    );


    pauseBtn.innerHTML =
        '<span class="action-icon">⏸</span><span>Pause</span>';


    drawGame();


    lastTime =
        performance.now();


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================================
   GAME OVER
========================================= */

function endGame() {

    gameRunning = false;
    paused = false;


    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }


    const final =
        Math.floor(score / 10);


    finalScore.textContent =
        final;


    if (final > bestScore) {

        bestScore = final;

        localStorage.setItem(
            "dinoBest",
            String(bestScore)
        );
    }


    bestText.textContent =
        bestScore;

    resultBest.textContent =
        bestScore;


    gameOverBox.classList.remove(
        "hidden"
    );

    pauseScreen.classList.add(
        "hidden"
    );
}


/* =========================================
   PAUSE
========================================= */

function pauseGame() {

    if (!gameRunning) {
        return;
    }


    paused = true;


    pauseScreen.classList.remove(
        "hidden"
    );


    pauseBtn.innerHTML =
        '<span class="action-icon">▶</span><span>Resume</span>';
}


/* =========================================
   RESUME
========================================= */

function resumeGame() {

    if (!gameRunning) {
        return;
    }


    paused = false;


    pauseScreen.classList.add(
        "hidden"
    );


    pauseBtn.innerHTML =
        '<span class="action-icon">⏸</span><span>Pause</span>';


    lastTime =
        performance.now();


    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );
    }


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================================
   TOGGLE PAUSE
========================================= */

function togglePause() {

    if (!gameRunning) {
        return;
    }


    if (paused) {

        resumeGame();

    } else {

        pauseGame();
    }
}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();

            jump();
        }


        if (
            event.code === "KeyP"
        ) {

            event.preventDefault();

            togglePause();
        }
    }
);


/* =========================================
   BUTTON CONTROLS
========================================= */

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    startGame
);


resumeBtn.addEventListener(
    "click",
    resumeGame
);


jumpBtn.addEventListener(
    "click",
    jump
);


pauseBtn.addEventListener(
    "click",
    togglePause
);


/* =========================================
   MOBILE + TOUCH CONTROLS
========================================= */

/*
   Game frame ko canvas ke parent se detect
   kar rahe hain taa-ke overlay ke upar tap
   bhi properly handle ho.
*/

const gameFrame =
    canvas.parentElement;


/*
   Mobile par game start:
   Start screen ke andar tap karne par
   game start ho jayega.
*/

gameFrame.addEventListener(
    "pointerdown",
    event => {

        if (
            event.pointerType === "touch"
        ) {

            event.preventDefault();


            /*
               Agar game start nahi hai aur
               start screen visible hai:
            */

            if (
                !gameRunning &&
                !startScreen.classList.contains("hidden")
            ) {

                startGame();

                return;
            }


            /*
               Agar game chal raha hai:
               tap = jump
            */

            if (gameRunning && !paused) {

                jump();
            }
        }
    },
    {
        passive: false
    }
);


/* =========================================
   MOBILE JUMP BUTTON
========================================= */

jumpBtn.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        if (
            event.pointerType === "touch"
        ) {

            jump();
        }
    },
    {
        passive: false
    }
);


/* =========================================
   PREVENT DOUBLE TAP ZOOM
========================================= */

canvas.addEventListener(
    "dblclick",
    event => {

        event.preventDefault();
    }
);


/* =========================================
   INITIAL DRAW
========================================= */

createCloud();
createCloud();

drawGame();
