const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const cz = innerHeight/480;
let frames = 0;
const DEGREE = Math.PI/180;

const sprite = new Image();
sprite.src = "img/sprite.png";

const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

const LVLUP = new Audio();
LVLUP.src = "audio/lvlup.mp3";

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

canvas.onclick = (e)=>{
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            let rect = canvas.getBoundingClientRect(),
                clickX = e.clientX - rect.left,
                clickY = e.clientY - rect.top;
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){   
                bird.speed = 0;
                bird.hit = false;
                pipes.position = [];
                score.value = 0;
                state.current = state.getReady;
            }
            break;
    }
}

const bg = {
    sX: 0,
    sY: 0,
    wI: 275,
    hI: 226,
    x: 0,
    y: canvas.clientHeight - 226*cz,
    w: 275*cz,
    h: 226*cz,

    draw: function(){
        for (let i = 0; i < Math.ceil(innerWidth/this.w); i++) {
            ctx.drawImage(sprite, this.sX, this.sY, this.wI, this.hI, this.x + this.w * i, this.y, this.w, this.h);
        }
    }
}

const fg = {
    sX: 276,
    sY: 0,
    wI: 224,
    hI: 112,
    x: 0,
    y: canvas.clientHeight - 112*cz,
    w: 224*cz,
    h: 112*cz,

    dx: 2*cz,

    draw: function(){
        for (let i = 0; i < Math.ceil(innerWidth/this.w); i++) {
            ctx.drawImage(sprite, this.sX, this.sY, this.wI, this.hI, this.x + this.w * i, this.y, this.w, this.h);
        }
    },

    update(){
        if(state.current === state.game)
            this.x = (this.x - this.dx)%(this.w/2);
    }
}

const bird = {
    animation : [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
    ],
    wI: 34,
    hI: 26,
    x: 50*cz,
    y: 150*cz,
    w: 34*cz,
    h: 26*cz,

    radius: 12*cz,

    frame: 0,

    hit: false,

    gravity: 0.25*cz,
    jump: 4.6*cz,
    speed: 0,
    rotation: 0,

    draw(){
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.wI, this.hI, - this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },

    flap(){
        this.speed = -this.jump;
    },

    update(){
        this.period = state.current === state.getReady ? 10 : 5;

        if(frames%this.period === 0)
            this.frame += 1;

        if(this.frame === 3)
            this.frame = 0;

        if(state.current === state.getReady){
            this.y = 150*cz;
            this.rotation = 0;
        } else {  
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.speed >= this.jump){
                this.frame = 1;
            }else if(!this.hit){
                this.rotation = -25 * DEGREE;
            }

            if(this.y + this.h/2 >= fg.y){
                this.y = fg.y - this.h/2;

                if(state.current === state.game){
                    state.current = state.over;
                    this.rotation = 90 * DEGREE;
                    DIE.play();
                }
            }
        }
    }
}

const getReady = {
    sX: 0,
    sY: 228,
    wI: 173,
    hI: 152,
    x: canvas.clientWidth/2 - 86.5*cz, //173/2
    y: 80*cz,
    w: 173*cz,
    h: 152*cz,

    draw: function(){
        if(state.current === state.getReady)
            ctx.drawImage(sprite, this.sX, this.sY, this.wI, this.hI, this.x, this.y, this.w, this.h);
    }
}

const gameOver = {
    sX: 175,
    sY: 228,
    wI: 225,
    hI: 202,
    x: canvas.clientWidth/2 - 112.5*cz, //225/2
    y: canvas.clientHeight/5,
    w: 225*cz,
    h: 202*cz,

    medal: {
        'aluminum' : {sX: 312, sY: 112},
        'bronze' : {sX: 360, sY: 158},
        'silver' : {sX: 360, sY: 112},
        'gold' : {sX: 312, sY: 158},

        wI: 44,
        hI: 44,
        x: canvas.clientWidth/2 - 225/2.6*cz,
        y: canvas.clientHeight/2.63,
        w: 44*cz,
        h: 44*cz
    },

    draw: function(){
        if(state.current === state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.wI, this.hI, this.x, this.y, this.w, this.h);

            const m = this.medal;

            switch(Math.floor(score.best/5)){
                case 0: 
                    break;
                case 1:
                    ctx.drawImage(sprite, m.aluminum.sX, m.aluminum.sY, m.wI, m.hI, m.x, m.y, m.w, m.h);
                    break;
                case 2:
                    ctx.drawImage(sprite, m.bronze.sX, m.bronze.sY, m.wI, m.hI, m.x, m.y, m.w, m.h);
                    break;
                case 3:
                    ctx.drawImage(sprite, m.silver.sX, m.silver.sY, m.wI, m.hI, m.x, m.y, m.w, m.h);
                    break;
                default:
                    ctx.drawImage(sprite, m.gold.sX, m.gold.sY, m.wI, m.hI, m.x, m.y, m.w, m.h);
            }
        }
    }
}

const startBtn = {
    x : canvas.clientWidth/2-gameOver.w/5,
    y : 263*cz,
    w : 83*cz,
    h : 29*cz
}

const pipes = {
    position: [],

    top: {
        sX: 553,
        sY: 0
    },

    bottom: {
        sX: 502,
        sY: 0
    },

    wI: 53,
    hI: 400,
    w: 53*cz,
    h: 400*cz,
    gap: 105*cz, //85 - значение зазора в оригинале
    maxYPos: -150*cz,
    dx: 2*cz,

    draw(){
        for(let i = 0; i< this.position.length; i++){
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.wI, this.hI, p.x, topYPos, this.w, this.h);
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.wI, this.hI, p.x, bottomYPos, this.w, this.h);
        }
    },

    update(){
        if(state.current !== state.game) return; // не создавать новые трубы если мы не играем

        // Создаем новые трубы каждые 100 кадров
        if(frames%100 === 0){
            this.position.push({
                x: canvas.clientWidth,
                y: this.maxYPos * (Math.random() + 1) // верхняя позиция трубы рандомная, нижняя подтроится через + gap
            });
        }

        for(let i = 0; i<this.position.length;i++){
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w 
                && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){

                HIT.play();
                bird.hit = true;
                bird.rotation = 90 * DEGREE;
                state.current = state.over;
            }

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w 
                && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){

                HIT.play();
                bird.hit = true;
                bird.rotation = 90 * DEGREE;
                state.current = state.over;
            }

            p.x -= this.dx;

            if(p.x + this.w <=0){
                this.position.shift();
                score.value += 1;
                if(score.value%5 === 0 && pipes.gap > 85*cz)
                {
                    LVLUP.play();
                    pipes.gap /= cz; 
                    pipes.gap -= 5;
                    pipes.gap *= cz; 
                } else {
                    SCORE_S.play();
                }

                if(score.value > score.best){
                    score.best = score.value;
                    localStorage.setItem('flappyBest', score.best)
                }
            }
        }
    }
}

const score = {
    best: parseInt(localStorage.getItem("flappyBest")) || 0,
    value: 0,

    draw(){
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';

        if(state.current === state.game){
            ctx.lineWidth = 2*cz;
            ctx.font = 'bold '+35*cz+'px Teko';
            ctx.fillText(this.value, canvas.clientWidth/2-15*cz,50*cz);
            ctx.strokeText(this.value, canvas.clientWidth/2-15*cz,50*cz);
        } else if(state.current === state.over){
            ctx.font = 'bold '+25*cz+'px Teko';
            if(this.value >= 100){ 
                ctx.fillText(this.value, canvas.clientWidth/2+gameOver.w/4.5,190*cz);
                ctx.strokeText(this.value, canvas.clientWidth/2+gameOver.w/4.5,190*cz);
            } else {
                ctx.fillText(this.value, canvas.clientWidth/2+gameOver.w/3.3,190*cz);
                ctx.strokeText(this.value, canvas.clientWidth/2+gameOver.w/3.3,190*cz);
            }

            if(this.best >= 100){ 
                ctx.fillText(this.best, canvas.clientWidth/2+gameOver.w/4.2,232*cz);
                ctx.strokeText(this.best, canvas.clientWidth/2+gameOver.w/4.2,232*cz);
            } else {
                ctx.fillText(this.best, canvas.clientWidth/2+gameOver.w/3.3,232*cz);
                ctx.strokeText(this.best, canvas.clientWidth/2+gameOver.w/3.3,232*cz);
            }
        }
    }
}

const draw = () => {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

const update = () => {
    bird.update();
    fg.update();
    pipes.update();
}

const loop = () => {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();