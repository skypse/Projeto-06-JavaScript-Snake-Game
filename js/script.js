// Definindo os Elementos do HTML
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Definindo variáveis do jogo
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Desenho do mapa, cobrinha, comida
function draw(){
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Desenho da cobrinha
function drawSnake(){
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Função responsável por criar a Cobrinha e Cubo de Comida/Div
function createGameElement(tag, className){
  const element = document.createElement(tag);
  // Cria uma div com className Snake
  element.className = className;
  return element;
}

// Definindo a posição da Cobrinha ou da Comida
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Testando a função para desenhar
// draw();

// Desenho da comida
function drawFood(){
  if (gameStarted){
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement)
  }
}

// Gerando a comida
function generateFood(){
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return{x, y};
}

// Mover a cobrinha
function move(){
  const head = {...snake[0]}
  switch (direction) {
    case 'up':
      head.y--;
      break;
      case 'down':
        head.y++;
        break;
        case 'left':
          head.x--;
          break;
          case 'right':
            head.x++;
            break;
  }

  snake.unshift(head);

  // snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Limpando passo anterior
    gameInterval = setInterval(() =>{
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
    playEatSound();
  } else {
    snake.pop();
  }
}


// Testando movimento
// setInterval(() =>{
//   move(); // Primeiro movimento
//   draw(); // Desenha novamente nova posição
// }, 200);

// Função para começar o jogo
function startGame(){
  gameStarted = true // Mantém o controle de jogo em execução
  const backgroundMusic = document.getElementById('backgroundMusic');
  backgroundMusic.play();
  backgroundMusic.volume = 0.1;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() =>{
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Evento de pressionar a tecla
function handleKeyPress(event){
  if ((!gameStarted && event.code === 'Space') ||
      (!gameStarted && event.key === ' ')
    ) {
      startGame();
    } else {
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break
          case 'ArrowDown':
            direction = 'down';
            break
            case 'ArrowLeft':
              direction = 'left';
              break
              case 'ArrowRight':
                direction = 'right';
                break
      }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
// console.log(gameSpeedDelay);

  if (gameSpeedDelay > 150){
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100){
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50){
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25){
    gameSpeedDelay -= 1;
  }
}

function checkCollision(){
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
    resetGame();
  }

  for (let i = 1; i < snake.length; i++){
    if (head.x === snake [i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame(){
  const backgroundMusic = document.getElementById('backgroundMusic');
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  updateScoreHighScore();
  stopGame();
  playGameOverSound();
  snake = [{x: 10, y:10}];
  food = generateFood();
  direction = 'right'
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore(){
  const currentScore = snake.length -1;
  score.textContent = currentScore.toString().padStart(2,'0');
}

function stopGame(){
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateScoreHighScore(){
  const currentScore = snake.length -1;
  if (currentScore > highScore){
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3,'0')
  }
  highScoreText.style.display = 'block';
}

function playEatSound() {
  const eatSound = document.getElementById('eatSound');
  eatSound.currentTime = 0; // Reinicia o áudio, caso ele já esteja tocando
  eatSound.volume = 0.4;
  eatSound.play();
}

function playGameOverSound() {
  const gameOverSound = document.getElementById('gameOverSound');
  gameOverSound.currentTime = 0; // Reinicia o áudio, caso ele já esteja tocando
  gameOverSound.volume = 0.2;
  gameOverSound.play();
}