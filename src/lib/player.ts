import Bomb from './bomb';
import Game, { Tile } from './game';
import { PowerupType } from './powerup';

const playerTile = new Image();
playerTile.src = new URL('../assets/player.png', import.meta.url).toString();

type Position = {
  x: number;
  y: number;
};

export type Controls = {
  up: string;
  down: string;
  left: string;
  right: string;
  place: string;
};

export default class Player {
  public controls: Controls = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    place: ' ',
  };
  public range = 2;
  public count = 1;
  public dead = false;
  public score = 0;

  private onScoreFn: (score: number) => void = () => {};

  constructor(private game: Game, public position: Position = { x: 0, y: 0 }) {
    game.players.push(this);
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (
          this.game.checkTile({
            x: this.position.x + x,
            y: this.position.y + y,
          })
        ) {
          game.arena[this.position.x + x][this.position.y + y] = Tile.empty;
        }
      }
    }
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  public draw() {
    this.game.ctx.drawImage(
      playerTile,
      this.position.x * this.game.config.tileSize + this.game.offset.x,
      this.position.y * this.game.config.tileSize + this.game.offset.y,
      this.game.config.tileSize,
      this.game.config.tileSize,
    );

    const powerup = this.game.powerups.find(
      (powerup) =>
        powerup.position.x === this.position.x &&
        powerup.position.y === this.position.y,
    );
    if (powerup) {
      const i = this.game.powerups.indexOf(powerup);
      this.game.powerups.splice(i, 1);

      switch (powerup.type) {
        case PowerupType.range:
          this.range++;
          break;
        case PowerupType.count:
          this.count++;
          break;
      }

      new Audio(
        new URL('../assets/powerup.wav', import.meta.url).toString(),
      ).play();
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case this.controls.up:
        this.position.y--;
        if (!this.game.checkTile(this.position, Tile.empty)) {
          this.position.y++;
        }
        break;

      case this.controls.down:
        this.position.y++;
        if (!this.game.checkTile(this.position, Tile.empty)) {
          this.position.y--;
        }
        break;

      case this.controls.left:
        this.position.x--;
        if (!this.game.checkTile(this.position, Tile.empty)) {
          this.position.x++;
        }
        break;

      case this.controls.right:
        this.position.x++;
        if (!this.game.checkTile(this.position, Tile.empty)) {
          this.position.x--;
        }
        break;

      case this.controls.place:
        if (this.getPlacedBombs().length < this.count) {
          const bomb = new Bomb(this.game, this, 2, this.range, {
            ...this.position,
          });
          bomb.onBreak(() => {
            this.score++;
            console.log('break');
            this.onScoreFn(this.score);
          });
          this.game.bombs.push(bomb);
        }
        break;
    }
  }

  public getPlacedBombs() {
    return this.game.bombs.filter((bomb) => bomb.player === this);
  }

  public onScore(callback: (score: number) => void) {
    this.onScoreFn = callback;
  }
}
