import SpriteComponent from './engine/components/sprite';
import Engine from './engine/game';
import Player from './game/player';

let keys: string[] = [];
document.addEventListener('keydown', (event) => keys.push(event.key));
document.addEventListener(
  'keyup',
  (event) => (keys = keys.filter((k) => k !== event.key)),
);

const canvas = document.getElementsByTagName('canvas')[0];

const game = new Engine(canvas);

const player = new Player();
const spriteComponent = new SpriteComponent();
player.registerComponent(spriteComponent);

game.add(player);

game.setup();

// const speed = 5;

// setInterval(() => {
//   game.clear();

//   if (keys.includes('w')) player.position.y -= speed;
//   if (keys.includes('a')) player.position.x -= speed;
//   if (keys.includes('s')) player.position.y += speed;
//   if (keys.includes('d')) player.position.x += speed;

//   game.draw(player);
// }, 1000 / 60);
