import Game, { Tile } from './game';

export const bombTile = new Image();
bombTile.src = new URL('../assets/bomb.png', import.meta.url).toString();

export default class Bomb {
  constructor(
    private game: Game,
    public timeout: number,
    public size: number,
    public position: { x: number; y: number },
  ) {}

  public tick() {
    this.timeout -= 1 / 60;

    if (this.timeout <= 0) {
      return this.explode();
    }

    this.game.ctx.drawImage(
      bombTile,
      this.position.x * this.game.config.tileSize + this.game.offset.x + 5,
      this.position.y * this.game.config.tileSize + this.game.offset.y + 5,
      60,
      60,
    );
  }

  private explode() {
    this.game.arena[this.position.x][this.position.y] = Tile.empty;

    for (let x = -this.size; x <= this.size; x++) {
      if (this.game.checkTile({ ...this.position, x: this.position.x + x })) {
        this.game.arena[this.position.x + x][this.position.y] = Tile.empty;
      }
    }
    for (let y = -this.size; y <= this.size; y++) {
      if (this.game.checkTile({ ...this.position, y: this.position.y + y })) {
        this.game.arena[this.position.x][this.position.y + y] = Tile.empty;
      }
    }

    const i = this.game.bombs.indexOf(this);
    this.game.bombs.splice(i, 1);
  }
}
