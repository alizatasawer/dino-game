const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("bestScore");

const startScreen = document.getElementById("startScreen");
const gameOverBox = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const jumpBtn = document.getElementById("jumpBtn");
const pauseBtn = document.getElementById("pauseBtn");

const finalScore = document.getElementById("finalScore");


let gameRunning = false;
let paused = false;


let score = 0;

let bestScore = localStorage.getItem("dinoBest") || 0;

bestText.innerHTML = bestScore;


let dino = {

    x:80,

    y:220,

    width:45,

    height:50,

    gravity:0.8,

    jumpPower:-14,

    velocity:0,

    jumping:false

};


let obstacles = [];

let clouds = [];

let speed = 6;



// Ground

let ground = {

    y:270

};



function createCloud(){

    clouds.push({

        x:900,

        y:40 + Math.random()*80,

        width:70,

        height:25

    });

}


function createObstacle(){

    obstacles.push({

        x:900,

        y:220,

        width:25,

        height:50

    });

}


function drawDino(){

    ctx.fillStyle="#7c3aed";

    ctx.shadowColor="#7c3aed";

    ctx.shadowBlur=15;


    ctx.fillRect(

        dino.x,

        dino.y,

        dino.width,

        dino.height

    );


    ctx.shadowBlur=0;


    ctx.fillStyle="white";

    ctx.fillRect(

        dino.x+30,

        dino.y+10,

        8,

        8

    );

}


function drawObstacles(){

    ctx.fillStyle="#16a34a";


    obstacles.forEach(ob=>{


        ctx.fillRect(

            ob.x,

            ob.y,

            ob.width,

            ob.height

        );


    });

}

function drawClouds(){

    ctx.fillStyle="rgba(255,255,255,0.7)";


    clouds.forEach(cloud=>{


        ctx.beginPath();


        ctx.arc(

            cloud.x,

            cloud.y,

            20,

            0,

            Math.PI*2

        );


        ctx.fill();


    });

}


function moveObjects(){


    obstacles.forEach(ob=>{

        ob.x -= speed;

    });



    clouds.forEach(cloud=>{

        cloud.x -= 1;

    });



    obstacles = obstacles.filter(

        ob=>ob.x>-50

    );


    clouds = clouds.filter(

        c=>c.x>-100

    );

}



// Dino physics

function updateDino(){


    dino.velocity += dino.gravity;

    dino.y += dino.velocity;



    if(dino.y >=220){

        dino.y=220;

        dino.velocity=0;

        dino.jumping=false;

    }

}


function jump(){


    if(!gameRunning)

        return;


    if(!dino.jumping){

        dino.velocity=dino.jumpPower;

        dino.jumping=true;
    } 
}
    
function checkCollision(){


    obstacles.forEach(ob=>{


        if(

            dino.x < ob.x + ob.width &&

            dino.x + dino.width > ob.x &&

            dino.y < ob.y + ob.height &&

            dino.y + dino.height > ob.y

        ){

            endGame();

        }


    });

}



function draw(){


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    ctx.fillStyle="#334155";

    ctx.fillRect(

        0,

        ground.y,

        canvas.width,

        5

    );



    drawClouds();

    drawDino();

    drawObstacles();


}


function gameLoop(){


    if(!gameRunning || paused)

        return;

    updateDino();


    moveObjects();


    checkCollision();


    score++;


    scoreText.innerHTML=Math.floor(score/10);



    if(score % 500 ===0){

        createObstacle();

    }


    if(score % 300 ===0){

        createCloud();

    }



    draw();


    requestAnimationFrame(gameLoop);

}


function startGame(){


    gameRunning=true;

    paused=false;


    score=0;

    obstacles=[];

    clouds=[];


    dino.y=220;


    startScreen.classList.add("hidden");


    gameOverBox.classList.add("hidden");


    gameLoop();

}

function endGame(){


    gameRunning=false;


    let final=Math.floor(score/10);


    finalScore.innerHTML=final;



    if(final>bestScore){

        bestScore=final;

        localStorage.setItem(

            "dinoBest",

            bestScore

        );

        bestText.innerHTML=bestScore;

    }



    gameOverBox.classList.remove("hidden");

}


function pauseGame(){


    if(gameRunning){

        paused=!paused;


        if(paused){

            pauseBtn.innerHTML="▶ Resume";

        }

        else{

            pauseBtn.innerHTML="⏸ Pause";

            gameLoop();

        }

    }

}

document.addEventListener(

"keydown",

(e)=>{


    if(e.code==="Space" || e.code==="ArrowUp"){

        jump();

    }


});


startBtn.onclick=startGame;


restartBtn.onclick=startGame;


jumpBtn.onclick=jump;


pauseBtn.onclick=pauseGame;


draw();

createCloud();
