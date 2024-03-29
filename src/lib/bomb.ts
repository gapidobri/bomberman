import Game, { Tile } from './game';
import Player from './player';

const bombTile = new Image();
bombTile.src = new URL('../assets/bomb.png', import.meta.url).toString();

const explosionTile = new Image();
explosionTile.src = new URL(
  '../assets/explosion.png',
  import.meta.url,
).toString();

const explosionSound = new Audio(
  new URL('../assets/explosion.wav', import.meta.url).toString(),
);

export default class Bomb {
  constructor(
    private game: Game,
    public player: Player,
    public timeout: number,
    public size: number,
    public position: { x: number; y: number },
  ) {}

  private scale = 40;
  private scaleMod = 1;
  private exploded = false;
  private animationTimeout = 150;

  private onBreakFn: () => void = () => {};

  public tick() {
    this.animationTimeout--;
    if (this.exploded) {
      if (this.animationTimeout <= 0) {
        const i = this.game.bombs.indexOf(this);
        this.game.bombs.splice(i, 1);
        return;
      }

      for (let x = -this.size; x <= this.size; x++) {
        this.game.ctx.drawImage(
          explosionTile,
          (this.position.x + x) * this.game.config.tileSize +
            this.game.offset.x,
          this.position.y * this.game.config.tileSize + this.game.offset.y,
          this.game.config.tileSize,
          this.game.config.tileSize,
        );
      }

      for (let y = -this.size; y <= this.size; y++) {
        this.game.ctx.drawImage(
          explosionTile,
          this.position.x * this.game.config.tileSize + this.game.offset.x,
          (this.position.y + y) * this.game.config.tileSize +
            this.game.offset.y,
          this.game.config.tileSize,
          this.game.config.tileSize,
        );
      }

      explosionSound.play();

      return;
    }

    this.timeout -= 1 / 60;
    this.scale += this.scaleMod;
    if (this.scale <= 40 || this.scale > 60) {
      this.scaleMod = this.scaleMod * -1;
    }

    if (this.timeout <= 0) {
      return this.explode();
    }

    this.game.ctx.drawImage(
      bombTile,
      this.position.x * this.game.config.tileSize +
        this.game.offset.x -
        this.scale / 2 +
        this.game.config.tileSize / 2,
      this.position.y * this.game.config.tileSize +
        this.game.offset.y -
        this.scale / 2 +
        this.game.config.tileSize / 2,
      this.scale,
      this.scale,
    );
  }

  private explode() {
    this.game.arena[this.position.x][this.position.y] = Tile.empty;

    for (let x = -this.size; x <= this.size; x++) {
      if (this.game.checkTile({ ...this.position, x: this.position.x + x })) {
        if (
          this.game.checkTile(
            { ...this.position, x: this.position.x + x },
            Tile.wall,
          )
        ) {
          this.onBreakFn();
        }
        this.game.arena[this.position.x + x][this.position.y] = Tile.empty;
        for (const player of this.game.players) {
          if (
            player.position.x === this.position.x + x &&
            this.player.position.y === this.position.y
          ) {
            player.dead = true;
          }
        }
      }
    }
    for (let y = -this.size; y <= this.size; y++) {
      if (this.game.checkTile({ ...this.position, y: this.position.y + y })) {
        if (
          this.game.checkTile(
            { ...this.position, y: this.position.y + y },
            Tile.wall,
          )
        ) {
          this.onBreakFn();
        }
        this.game.arena[this.position.x][this.position.y + y] = Tile.empty;
        for (const player of this.game.players) {
          if (
            player.position.x === this.position.x &&
            this.player.position.y === this.position.y + y
          ) {
            player.dead = true;
          }
        }
      }
    }

    this.exploded = true;
  }

  public onBreak(callback: () => void) {
    this.onBreakFn = callback;
  }
}
