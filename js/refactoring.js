const config = {
  fps: 6,
  initialSizeTail: 3,
  scorePerFood: 10,
  speedIncreasePerFood: 0.05,
  scorePerLevel: 160,
  pixelSize: 20,
  phaseColor: [
    {cobra: "black",fundo:  "#dfff80", fruta: "red"},
    {cobra: "#173036",fundo:  "#ecf0f1", fruta: "#3333ff"},
    {cobra: "#186839",fundo:  "#ccfff2", fruta: "#800000"},
    {cobra: "#71180e",fundo:  "#bdc3c7", fruta: "#d35400"},
    {cobra: "#3c1d49",fundo:  "#f8c36d", fruta: "#f1c40f"},
    {cobra: "white",fundo:  "black", fruta: "#ccff33"}
  ]
}

class Storage {
  static get(key) {
    JSON.parse(localStorage.getItem(key))
  }
  static set(key, value) {
    JSON.stringify(localStorage.setItem(key, value))
  }
}

class Snake {

}

class Food {
  
}

class Display {
  constructor(){
    this.graphics = {
      scenario: document.querySelector('#cenario'),
      record: document.querySelector('#record'),
      score: document.querySelector('#pontos'),
      lastScore: document.querySelector('#pontoAnterior'),
      level: document.querySelector('#level')
    }
    this.context = cenario.getContext("2d")
  }
  setRecord(record){
    record.innerHTML = record || 0;
  }
}

class Controller {
  constructor(){
    
  }
}

class Game {
  constructor(Display, Controller, Storage, config){
    this.Display = Display
    this.Controller = Controller
    this.Storage = Storage
    this.config = config
  }
  
  setInitialSetup() {
  }
}

const game = new Game(new Display, new Controller, new Storage, config)
game.setInitialSetup()