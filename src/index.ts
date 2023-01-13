import Game from './lib/game';
import Player from './lib/player';
import { loadFromStorage } from './settings';

const canvas = document.getElementsByTagName('canvas')[0];
const gui = document.getElementById('gui')!;
const player1Score = document.getElementsByClassName('player1score');
const player2Score = document.getElementsByClassName('player2score');
const modal = document.getElementById('modal')!;
const message = document.getElementById('message')!;
const closeBtn = document.getElementById('close');

let game: Game;
function setup(config: {
  tileSize: number;
  tileCount: number;
  powerupCount: number;
}) {
  game = new Game(canvas, config);

  const player1 = new Player(game);
  player1.onScore((score) => {
    Array.from(player1Score).forEach((el) => (el.innerHTML = score.toString()));
  });
  player1.controls = loadFromStorage('p1controls') ?? {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    place: ' ',
  };

  const player2 = new Player(game, {
    x: game.config.tileCount - 1,
    y: game.config.tileCount - 1,
  });
  player2.controls = loadFromStorage('p2controls') ?? {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    place: 'q',
  };

  player2.onScore((score) => {
    Array.from(player2Score).forEach((el) => (el.innerHTML = score.toString()));
  });

  Array.from(player1Score).forEach((el) => (el.innerHTML = '0'));
  Array.from(player2Score).forEach((el) => (el.innerHTML = '0'));

  game.onLose((player) => {
    if (player === player2) {
      message.innerText = 'Player 1 won!';
    } else {
      message.innerText = 'Player 2 won!';
    }
    modal.style.visibility = 'visible';
  });

  gui.style.display = 'none';
  game.start();
}

function level1() {
  setup({ tileCount: 8, tileSize: 60, powerupCount: 10 });
}

function level2() {
  setup({ tileCount: 14, tileSize: 60, powerupCount: 20 });
}

function level3() {
  setup({ tileCount: 18, tileSize: 60, powerupCount: 30 });
}

document.getElementById('level1')?.addEventListener('click', level1);
document.getElementById('level2')?.addEventListener('click', level2);
document.getElementById('level3')?.addEventListener('click', level3);

closeBtn?.addEventListener('click', () => {
  modal.style.visibility = 'hidden';
  gui.style.display = 'flex';
});
