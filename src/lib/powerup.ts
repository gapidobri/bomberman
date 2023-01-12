import Game from './game';

export enum PowerupType {
  range = 'range',
  count = 'count',
}

export const rangeTile = new Image();
rangeTile.src = new URL('../assets/range.png', import.meta.url).toString();

export const countTile = new Image();
countTile.src = new URL('../assets/count.png', import.meta.url).toString();

const powerupAssets = {
  [PowerupType.range]: rangeTile,
  [PowerupType.count]: countTile,
};

export default class Powerup {
  constructor(
    private game: Game,
    public type: PowerupType,
    public position: { x: number; y: number },
  ) {
    this.game.powerups.push(this);
  }

  public draw() {
    this.game.ctx.drawImage(
      powerupAssets[this.type],
      this.position.x * this.game.config.tileSize + this.game.offset.x,
      this.position.y * this.game.config.tileSize + this.game.offset.y,
      this.game.config.tileSize,
      this.game.config.tileSize,
    );
  }
}
