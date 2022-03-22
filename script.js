let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");

let START = 1, PLAY = 2, OVER=3;
let gameState = START;

let score = 0;


let gravity = 0.1;
let catX = catY = hyp = 0;

let ball = {
    radius: 20,
    vx: 0,
    vy:0,
    x: cnv.width/2 - 10,
    y: 50,
    color: "000",
    touched: false,
    visible: false

}


let messages = [];

let startMesage= {
    text: "TOQUE PARA INICIAR",
    y: cnv.height/2-200,
    font: "bold 15px Sans-Serif",
    color: "#000",
    visible: true,

};
messages.push(startMesage);

let scoreText = Object.create(startMesage);
scoreText.visible = false;

messages.push(scoreText);

document.addEventListener("mousedown", function (event){
    catX=ball.x - event.offsetX;
    catY=ball.y - event.offsetY;
    hyp = Math.sqrt(catX*catX+catY*catY);
    switch(gameState){
        case START:
            gameState = PLAY;
            startMesage.visible = false;
            startGame();
            break;
        case PLAY:
            if(hyp < ball.radius && !ball.touched){
                ball.vx = Math.floor(Math.random()*21)-10;
                ball.vy = -(Math.floor(Math.random()*6+5));
                ball.touched = true;
                score++;
            }
            break;
    }

}, false);

document.addEventListener("mouseup", function (){
    if(gameState == PLAY){
        ball.touched = false;
    }
})


function loop(){
    requestAnimationFrame(loop);
    if(gameState===PLAY){
        update();
    }
    render();
}
function update(){
    ball.vy += gravity;
    ball.y += ball.vy;
    ball.x += ball.vx;

    if(ball.x+ball.radius>cnv.width || ball.x<ball.radius){
        if(ball.x<ball.radius){
            ball.x = ball.radius;
        }else{
            ball.x = cnv.width - ball.radius;
        }
        ball.vx*=-0.8;
    }
    if(ball.y<ball.radius && ball.vy < 0){
        ball.y = ball.radius;
        ball.vy *= -1
    }


    if(ball.y - ball.radius>cnv.height){
        gameState=OVER;
        ball.visible=false;
        window.setTimeout(function(){
            startMesage.visible = true;
            gameState=START;

        },2000);

    }

}
function render(){
    ctx.clearRect(0,0,cnv.width,cnv.height);

    if(ball.visible){
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("SCORE: "+score, 10,20)
    }


    for(let i in messages){
        let msg = messages[i];
        if(msg.visible){
            ctx.font = msg.font;
            ctx.fillStyle = msg.color;
            ctx.fillText(msg.text,70,150)
        }
    }

}
function startGame(){
    ball.vy = 0;
    ball.y = 50;
    ball.vx = Math.floor(Math.random()*21) - 10;
    ball.x = Math.floor(Math.random()*261)+20;
    ball.visible = true;
    score = 0;


}

loop()