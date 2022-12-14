const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");

const modalGameOver = document.querySelector('#modalGameOver');
const modalPassarNivel = document.querySelector('#modalPassarNivel');
const btnRepetirJogo = document.querySelector('#btnRepetirJogo');
const btnPassarNivel = document.querySelector('#btnPassarNivel');
const btnRepetirJogo1 = document.querySelector('#btnRepetirJogo1');

// button passar de nível abir nova pagina com o próximo nível
btnPassarNivel.addEventListener('click', function() {
    window.location.href = "/html/nivel2.html";
});

// button repetir jogo abir nova pagina com o mesmo nível
btnRepetirJogo1.addEventListener('click', function() {
    window.location.href = "/html/nivel1.html";
});

// largura e altura do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// função que remoove a barra de scroll do navegador
window.addEventListener("load", function () {
    document.body.style.overflow = "hidden";
});

//CANVAS SIZE
const W = canvas.width, H = canvas.height;

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;

let images = {};
let totalResources = 6;
let numResourcesLoaded = 0;
let fps = 15;

let score = 0;
let showLevel = 1;
let time = 90;

// desenhar uma passadeira onde passa o lixo para o centro do canvas
function drawPassadeira() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(190, H/2 + 220, 750, 100);

    // desenhar varios retangulos na passadeira para dar a ilusão de movimento
    ctx.fillStyle = "#000000";
    ctx.fillRect(200, H/2 + 230, 25, 80);
    ctx.fillRect(250, H/2 + 230, 25, 80);
    ctx.fillRect(300, H/2 + 230, 25, 80);
    ctx.fillRect(350, H/2 + 230, 25, 80);
    ctx.fillRect(400, H/2 + 230, 25, 80);
    ctx.fillRect(450, H/2 + 230, 25, 80);
    ctx.fillRect(500, H/2 + 230, 25, 80);
    ctx.fillRect(550, H/2 + 230, 25, 80);
    ctx.fillRect(600, H/2 + 230, 25, 80);
    ctx.fillRect(650, H/2 + 230, 25, 80);
    ctx.fillRect(700, H/2 + 230, 25, 80);
    ctx.fillRect(750, H/2 + 230, 25, 80);
    ctx.fillRect(800, H/2 + 230, 25, 80);
    ctx.fillRect(850, H/2 + 230, 25, 80);
    ctx.fillRect(900, H/2 + 230, 25, 80);
}
// se o nome do lixo terminar em B, então é para o ecoponto azul (Blue), G = ecoponto verde (Green) e Y = ecoponto amarelo (Yellow)
let nomes_lixos = ['saco_plasticoY', 'saco_papelB', 'garrafaY', 'garrafa_aguaY', 'copoG', 'paperB'];
const nr_lixos = nomes_lixos.length;
let nomes_ecopontos = ['ecoponto_azul', 'ecoponto_amarelo', 'ecoponto_verde'];
for (const ecoponto of nomes_ecopontos) {
    loadImage(ecoponto, false); // false porque não é um lixo
}


for (const nome of nomes_lixos) {
    loadImage(nome, true); // true porque é um lixo
}


function loadImage(nome, e_nome_lixo) {
    images[nome] = new Image();
    // se for um lixo, então o nome do ficheiro é diferente do nome da variável que guarda o nome do lixo (ex: saco_plasticoY.png)
    e_nome_lixo ? images[nome].src = "/images/" + nome.substring(0, nome.length - 1) + ".png": images[nome].src = "/images/" + nome + ".png"; 
    images[nome].onload = function () {
        resourceLoaded(); 
    }
    
}

function resourceLoaded() { 
    numResourcesLoaded += 1;
    if (numResourcesLoaded === totalResources) {
        //setInterval(render, 3000 / fps);ç
        render()
    }
}

// imagem da bola de praia onde vai esconder os lixos
let imgBall = new Image();
imgBall.src = "/images/beach-ball.png";
imgBall.onload = function () {
    ctx.drawImage(imgBall, 0, 500, 200, 200);
}


let x = 0; // posição inicial
let y = 0; 
let speed = 2; // velocidade de movimento
let mover_proxima_imagem = false; // variável que permite mover a próxima imagem
// criar uma classe lixos e com proprideades diferentes
class Lixo {
    constructor(src, x, y, width, height, speed, l, indice, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.src = src;
        this.speed = speed;
        this.l = l;
        this.indice = indice;
        this.tipo = type;
        
    }

    draw() {
        ctx.drawImage(this.src, this.x, this.y, this.width, this.height);
    }

    // função que faz o lixo mover ate o meio do canvas e parar
    move() {
       
        if (this.x < W/3 + 150 + this.l) { // 
            this.x += this.speed; // mover para a direita
        }
        else
            mover_proxima_imagem = true; // se o lixo chegar ao meio do canvas, então mover a próxima imagem

    }

}

// class ecoponto
class Ecoponto {
    constructor(x, y, width, height,type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }
    
    // draw the ecoponto
    draw() {
        ctx.drawImage(images[this.type], this.x, this.y, this.width, this.height);
    }
}

// nova instacia da classe ecoponto
let ecoponto_azul = new Ecoponto(300, 200, 200, 200, 'ecoponto_azul');
let ecoponto_amarelo = new Ecoponto(550, 200, 200, 200, 'ecoponto_amarelo');
let ecoponto_verde = new Ecoponto(800, 200, 200, 200, 'ecoponto_verde');

// função que desenha os ecopontos no canvas
function drawEcopontos() {
    ecoponto_azul.draw();
    ecoponto_amarelo.draw();
    ecoponto_verde.draw();

}



let l = -100 // posição inicial do lixo
for (const nome_lixo of nomes_lixos) {

    images[nome_lixo].lixo = new Lixo(images[nome_lixo], l, H/2+ 250, 50, 50, speed, l); // criar uma nova instância da classe lixo
    l += 50; // incrementar a posição inicial do lixo
}

let indice_x = nomes_lixos.length -1 // indice do array de imagens
// função de animação dos lixos para o centro do canvas
function animate() {

    for (const nome_lixo of nomes_lixos) { // para cada imagem do array de imagens
        images[nome_lixo].lixo.draw();  // desenhar o lixo
    }
    
    images[nomes_lixos[indice_x]].lixo.move();  // mover a imagem do lixo


    if(mover_proxima_imagem && indice_x > 0) { // se o lixo estiver no centro do canvas e o indice for maior que 0
        indice_x--; // decrementa o indice
        mover_proxima_imagem = false; // volta a false para não mover a próxima imagem
    }
}

// adicionar a pontução do jogador no canvas
function addScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Pontos: ${score}`, 70, 50);

}


// adicionar nível do jogador no canvas
function addLevel() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Nível: ${showLevel}` , 1200, 50);
}


// adicionar o botão de sair do jogo no canvas
function addExitButton() {
    
    // draw a rectangle and button text on it
    ctx.fillStyle = "white";
    ctx.fillRect(1200, 70, 100, 50);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Sair", 1220, 105);

    // border radius for the rectangle
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.strokeRect(1200, 70, 100, 50);

    // add event listener to the button
    canvas.addEventListener("click", function (e) {
        if (e.pageX >= 1200 && e.pageX <= 1300 && e.pageY >= 70 && e.pageY <= 120) { // if the click is inside the rectangle
            window.location.href = "../html/index.html";
        }
    });
}


// adicionar tempo no canvas
function addTime() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`${time}s`, 120, 110);

    
}

const timeDecrement = setInterval(function() {
    time--;
    if(time === 0) {
        clearInterval(timeDecrement);
        //alert("Acabou o tempo");
        // abrir a modal de fim de jogo
        modalGameOver.style.display = "block";

    }

}, 1000);


// imagem do cronometro
let imgTimer = new Image();
imgTimer.src = "/images/cronometro.png";
imgTimer.onload = function () {
    ctx.drawImage(imgTimer, 70, 70, 50, 50);
}

// drag and drop variables
let dragok = false; // global drag status
let startX = 0; // variável que guarda a posição inicial do eixo x
let startY = 0 ; // variárel que guarda a posição inicial do eixo y
// variavel i
let i = 0;


// function the mousedown in array the images
function mouseDown(e) {

    e.preventDefault();

    // get the mouse position
    let mx = e.pageX - canvas.offsetLeft; // posição do mouse no eixo x
    let my = e.pageY - canvas.offsetTop; // posição do mouse no eixo y

    // for loop to check if the mouse is inside the images
    for (i = 0; i < nomes_lixos.length; i++) { // loop para verificar se o mouse está dentro das imagens
        let s = images[nomes_lixos[i]].lixo; // variável que guarda a posição do lixo
        if (mx > s.x && mx < s.x + s.width && my > s.y && my < s.y + s.height) { // se o mouse estiver dentro da imagem
            //verificar se uma propriedade de um objeto existe
            if (!s.hasOwnProperty('xInicial')) { 
                s.xInicial = s.x
                s.yInicial = s.y
            }
            dragok = true; // set the drag status to true
            startX = mx - s.x; // set the start x position
            startY = my - s.y; // set the start y position
            return;
        }

    }

    // if the mouse is not inside the images
    dragok = false;
    
}


// function mouse move in array the images
function mouseMove(e) {
    e.preventDefault();

    let mx = e.pageX - canvas.offsetLeft; // posição do mouse no eixo x
    let my = e.pageY - canvas.offsetTop; // posição do mouse no eixo y

    if (dragok) { // se o drag estiver ativo
        let mx = e.pageX - canvas.offsetLeft; // posição do mouse no eixo x
        let my = e.pageY - canvas.offsetTop; // posição do mouse no eixo y
        let s = images[nomes_lixos[i]].lixo; // variável que guarda a imagem do lixo
        s.x = mx - startX; // posição do eixo x da imagem do lixo
        s.y = my - startY; // posição do eixo y da imagem do lixo
    }
    
}
    
// function mouse up in array the images
function mouseUp(e) {
    
    e.preventDefault();
    dragok = false;

    collision(); // verificar se houve colisão
}

let nr_lixos_eliminados = 0
// verifica se o mouse está dentro do ecoponto de lixo correto e adiciona pontos
function collision() {
    let s = images[nomes_lixos[i]].lixo; // variável que guarda a imagem do lixo
    let mx = s.x; // posição do eixo x da imagem do lixo
    let my = s.y; // posição do eixo y da imagem do lixo 

    // colisão com o ecoponto azul
    if (mx > 300 && mx < 500 && my > 200 && my < 400) {
        if (nomes_lixos[i].slice(-1) == "B") { // se o nome do lixo terminar em B
            console.log("acertou", nomes_lixos[i]);   
            // eliminar uma propriedade do objeto
            delete images[nomes_lixos[i]];
            nr_lixos_eliminados++
            if (nr_lixos_eliminados == nr_lixos) {
                console.log("acabou");
                modalPassarNivel.style.display = "block";
            } 
            // eliminar o lixo do array
            nomes_lixos.splice(i, 1);
            
            score ++;
        } else {
            if (score > 0) {
                score --;
            }
            s.x = s.xInicial; // posição do eixo x da imagem do lixo
            s.y = s.yInicial; // posição do eixo y da imagem do lixo
        }
    }

    // colisão com o ecoponto amarelo
    if (mx > 550 && mx < 750 && my > 200 && my < 400) {
        if (nomes_lixos[i].slice(-1) == "Y") { // se o nome do lixo terminar em Y
            delete images[nomes_lixos[i]];
            nr_lixos_eliminados++
            if (nr_lixos_eliminados == nr_lixos) {
                modalPassarNivel.style.display = "block";
            }

            // eliminar o lixo do array
            nomes_lixos.splice(i, 1);
            score ++;

        } else {
            if (score > 0) {
                score --;
            }
            s.x = s.xInicial; // posição do eixo x da imagem do lixo
            s.y = s.yInicial; // posição do eixo y da imagem do lixo
        }
    }

    // colisão com o ecoponto verde
    if (mx > 800 && mx < 1000 && my > 200 && my < 400) {
        if (nomes_lixos[i].slice(-1) == "G") { // verificar se o último caracter do nome do lixo é igual a G
            delete images[nomes_lixos[i]];
            nr_lixos_eliminados++
            if (nr_lixos_eliminados == nr_lixos) {
                modalPassarNivel.style.display = "block";
            } 
            // eliminar o lixo do array
            nomes_lixos.splice(i, 1);
            score ++;
        } else {
            if (score > 0) {
                score --;
            }
            s.x = s.xInicial; // posição do eixo x da imagem do lixo
            s.y = s.yInicial; // posição do eixo y da imagem do lixo
        }
    }

}


// render minhas imagens em canvas
function render() {
    
    ctx.clearRect(0, 0, W, H);

    drawPassadeira();
    

    drawEcopontos();
    animate();
    

    // chamar minha imagem da bola de praia
    ctx.drawImage(imgBall, 0, 500, 200, 200);

    // chamar a imagem do cronometro
    ctx.drawImage(imgTimer, 70, 70, 50, 50);

    addScore();
    addLevel();
    addTime();
    addExitButton();

    requestAnimationFrame(render);

}