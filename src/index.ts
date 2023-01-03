import Game, { Tile } from './lib/game';
import Player from './lib/player';

const canvas = document.getElementsByTagName('canvas')[0];

const game = new Game(canvas);

const player1 = new Player(game);
// const player2 = new Player(game);
// player2.controls = { up: 'w', left: 'a', down: 's', right: 'd', place: 'q' };

game.arena[0][0] = Tile.empty;
game.arena[1][0] = Tile.empty;
game.arena[2][0] = Tile.empty;
game.arena[3][0] = Tile.empty;
game.arena[4][0] = Tile.empty;
game.arena[4][1] = Tile.empty;
game.arena[4][2] = Tile.empty;
game.arena[4][3] = Tile.empty;
game.arena[4][4] = Tile.empty;
game.arena[3][4] = Tile.empty;
