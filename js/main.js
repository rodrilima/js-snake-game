//Carregando Elementos HTML
var cenario = document.querySelector('#cenario');
var record = document.querySelector('#record');
var pontos = document.querySelector('#pontos');
var pontoAnterior = document.querySelector('#pontoAnterior');
var level = document.querySelector('#level');

record.innerHTML = localStorage.getItem("recorde") || 0;

//Preparando as Ferramentas do Cenário
var ferramentas = cenario.getContext("2d");

//Configurações Alteráveis
var pontosPorComida = 10;
var tamanhoInicialDaCauda = 3;
var aumentoVelocidadePorComida = 0.05;
var fps = 6;
var pontosPorLevel = 160;

//Definições Padrões do Jogo
var pixel = 20;
var corDoJogo = [
  {cobra: "black",fundo:  "#dfff80", fruta: "red"},
  {cobra: "#173036",fundo:  "#ecf0f1", fruta: "#3333ff"},
  {cobra: "#186839",fundo:  "#ccfff2", fruta: "#800000"},
  {cobra: "#71180e",fundo:  "#bdc3c7", fruta: "#d35400"},
  {cobra: "#3c1d49",fundo:  "#f8c36d", fruta: "#f1c40f"},
  {cobra: "white",fundo:  "black", fruta: "#ccff33"}
];
var numeroDoCenario = 0;
var limites = {
  x: cenario.width/pixel,
  y: cenario.height/pixel
}
var avanco = {
  x: pixel,
  y: 0
}
var cobra = {
  posX: 6*pixel,
  posY: 9*pixel,
  cauda: [],
  tamanho: tamanhoInicialDaCauda
}
var comida = {
  posX: Math.floor(Math.random()*limites.x)*pixel,
  posY: Math.floor(Math.random()*limites.y)*pixel
}
var intervalo;
var fpsAtual = fps;
var atualizarFPS = function(){
  intervalo = setInterval(game,1000/fpsAtual);
}
atualizarFPS();
document.addEventListener("keydown", armazenarComandos);
lerMobile();

var comandos = [];
function armazenarComandos (event) {
  if(comandos.length < 3 && pausado == false) comandos.push(event.keyCode);
}

//Engine do Jogo
function game (){
  
  seComeuAComida();
  
  aumentarCauda();
  
  verificaLevel();
  
  lerComandos();
  
  posicionarCobra();
  
  graficos.desenharCenario();
  
  graficos.desenharCobra();
  
  graficos.desenharComida();
  
  seBateuNaCauda();
  
  if(proximoNivel == true){
    graficos.escrever("Level "+levelAtual,cenario.width/2,40,"28px Times New Roman");
  }
  
}

var levelAtual, proximoNivel=true;
window.setTimeout(function(){proximoNivel=false;}, 3000);

var aux = 0;
function verificaLevel(){
  levelAtual = Number(pontos.innerHTML)/pontosPorLevel;
  levelAtual = Math.floor(levelAtual)+1;
  level.innerHTML = "Level "+levelAtual;
  if (numeroDoCenario < corDoJogo.length) numeroDoCenario = levelAtual;
  
  if (levelAtual == aux+1){
    aux = levelAtual;
    proximoNivel=true; 
    window.setTimeout(function(){proximoNivel=false;}, 3000);
  }
}

 function lerComandos(){
   if (comandos.length > 0){
    switch (comandos[0]) {
      case 37:
        if (avanco.x != pixel){
          avanco.x = -pixel;
          avanco.y = 0;
        }
        break;
       case 38:
        if (avanco.y != pixel){
          avanco.x = 0;
          avanco.y = -pixel;
        }
        break;
       case 39:
        if (avanco.x != -pixel){
          avanco.x = pixel;
          avanco.y = 0;
        }
        break;
       case 40:
        if (avanco.y != -pixel){
          avanco.x = 0;
          avanco.y = pixel;
        }
        break;
      }
     comandos.shift();
   }
  }
  
  function posicionarCobra(){
      //Nova posição da cobra
      cobra.posX += avanco.x;
      cobra.posY += avanco.y;

      //Cobra aparece do outro lado do cenário
      if(cobra.posX == cenario.width){
        cobra.posX = 0; 
       } else if(cobra.posX == -pixel){
        cobra.posX = cenario.width-pixel; 
       } else if(cobra.posY == cenario.height){
        cobra.posY = 0; 
       } else if(cobra.posY == -pixel){
        cobra.posY = cenario.height-pixel; 
       }
  }
  
  function aumentarCauda(){
      cobra.cauda.push({x: cobra.posX, y: cobra.posY});
      while(cobra.cauda.length > cobra.tamanho){
      cobra.cauda.shift();
    }
  }
  var teste = 0;
  function seComeuAComida(){
    function gerarComida(){
      comida.posX = Math.floor(Math.random()*limites.x)*pixel;
      comida.posY = Math.floor(Math.random()*limites.y)*pixel;
    }
    
    if(cobra.posX == comida.posX && cobra.posY == comida.posY){
      gerarComida();
      for(var i = 0; i < cobra.cauda.length; i++){
        if(cobra.cauda[i].x == comida.posX && cobra.cauda[i].y == comida.posY || cobra.posX == comida.posX && cobra.posY == comida.posY){
          gerarComida();
          i=0;
          console.log("novaComidaGerada "+teste);
          teste++ 
        }
      }
      cobra.tamanho++;
      fpsAtual += aumentoVelocidadePorComida;
      clearInterval(intervalo);
      atualizarFPS();
      pontos.innerHTML = Number(pontos.innerHTML) + pontosPorComida;
      if (Number(pontos.innerHTML) > Number(record.innerHTML)){
        record.innerHTML = Number(pontos.innerHTML);
        localStorage.setItem("recorde", Number(record.innerHTML));
      }
    }
  }

function seBateuNaCauda (){
  cobra.cauda.map(function(posicaoCauda){
    if(posicaoCauda.x == cobra.posX && posicaoCauda.y == cobra.posY) gameOver();
  });
}

function pauseGame(){clearInterval(intervalo);}
function startGame(){atualizarFPS();}
function gameOver(){
         pauseGame();
         cobra.tamanho = tamanhoInicialDaCauda;
         pontoAnterior.innerHTML = pontos.innerHTML;
         pontos.innerHTML = 0;
         fpsAtual = fps;
         startGame();
         aux = 0
         numeroDoCenario = 0;
}

var graficos = {
  escrever: function (texto, xInicial, yInicial, font){
    ferramentas.font = font;
    ferramentas.fillStyle = "red";
    ferramentas.textAlign = "center";
    ferramentas.fillText(texto,xInicial,yInicial); 
  },
  desenharRetangulo: function (cor, xInicial, yInicial, comprimento, altura ){
    ferramentas.fillStyle = cor;
    ferramentas.fillRect(xInicial, yInicial, comprimento, altura);
  },
  desenharArco: function (cor, xCentral, yCentral, raio, anguloInicial, anguloFinal ){
    ferramentas.beginPath();
    ferramentas.arc(xCentral, yCentral, raio, anguloInicial, anguloFinal);
    ferramentas.stroke(); 
    ferramentas.fillStyle = cor;
    ferramentas.fill();
  },
  desenharCenario: function(){
    this.desenharRetangulo(corDoJogo[numeroDoCenario-1].fundo,0,0,cenario.width, cenario.height);
  },
  desenharCobra: function() {
    var that = this;
    cobra.cauda.map(function(posicaoCauda){
      that.desenharRetangulo(corDoJogo[numeroDoCenario-1].cobra,posicaoCauda.x,posicaoCauda.y,pixel-1,pixel-1); 
    });
  },
  desenharComida: function(){
    this.desenharArco(corDoJogo[numeroDoCenario-1].fruta,comida.posX+10,comida.posY+10,10,0,2*Math.PI);
  }
}

function lerMobile(){
  var xInicial;
  var yInicial;
  var xDistancia;
  var yDistancia;
  var ditanciaLimite = 30;
  
  cenario.addEventListener("touchstart", function(evento){
    xInicial = parseInt(evento.changedTouches[0].clientX);
    yInicial = parseInt(evento.changedTouches[0].clientY);
  });
  
  cenario.addEventListener("touchmove", function(evento){
    xDistancia = parseInt(evento.changedTouches[0].clientX) - xInicial;
    yDistancia = parseInt(evento.changedTouches[0].clientY) - yInicial;
    if(xDistancia > ditanciaLimite ){
      comandos[0] = 39;
    } else if (xDistancia < -ditanciaLimite){
      comandos[0] = 37;       
    }
    if (yDistancia > ditanciaLimite){
      comandos[0] = 40;
    }else if (yDistancia < -ditanciaLimite){
      comandos[0] = 38;
    }
  });
}

var pausado = false;
  function pausar(){
    if(pausado == false){
      pauseGame();
      pausado = true;
    } else {
      startGame();
      pausado = false;
    }
  }