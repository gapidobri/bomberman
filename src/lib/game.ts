import Bomb from './bomb';
import Player from './player';
import Powerup, { PowerupType } from './powerup';

const dirtTile = new Image();
dirtTile.src = new URL('../assets/dirt.jpg', import.meta.url).toString();

export enum Tile {
  wall = 'wall',
  bomb = 'bomb',
  empty = 'empty',
}

type Config = {
  tileSize: number;
  tileCount: number;
  powerupCount: number;
};

export default class Game {
  public readonly ctx: CanvasRenderingContext2D;
  public offset = { x: 0, y: 0 };

  public arena: Tile[][] = [];
  public powerups: Powerup[] = [];
  public bombs: Bomb[] = [];
  public players: Player[] = [];

  private interval: number | null = null;
  private onLoseFn: (player: Player) => void = () => {};

  constructor(public canvas: HTMLCanvasElement, public config: Config) {
    const context = this.canvas.getContext('2d');
    if (!context) throw Error('Failed to get context');
    this.ctx = context;

    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.resizeCanvas();

    for (let i = 0; i < this.config.tileCount; i++) {
      this.arena.push([]);
      for (let j = 0; j < this.config.tileCount; j++) {
        this.arena[i].push(Tile.wall);
      }
    }

    for (let i = 0; i < this.config.powerupCount; i++) {
      const type = Math.floor(Math.random() * Object.keys(PowerupType).length);
      new Powerup(
        this,
        PowerupType[Object.keys(PowerupType)[type] as PowerupType],
        {
          x: Math.floor(Math.random() * this.config.tileCount),
          y: Math.floor(Math.random() * this.config.tileCount),
        },
      );
    }
  }

  public start() {
    this.resizeCanvas();

    this.interval = setInterval(this.loop.bind(this), 1000 / 60);
  }

  private loop() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.bombs.forEach((bomb) => bomb.tick());
    this.powerups.forEach((powerup) => powerup.draw());

    this.drawArena();

    this.players.forEach((player) => {
      if (player.dead) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.onLoseFn(player);
      }
      player.draw();
    });
  }

  private drawArena() {
    for (let x = 0; x < this.config.tileCount; x++) {
      for (let y = 0; y < this.config.tileCount; y++) {
        const posX = x * this.config.tileSize + this.offset.x;
        const posY = y * this.config.tileSize + this.offset.y;
        switch (this.arena[x][y]) {
          case Tile.wall:
            this.ctx.drawImage(
              dirtTile,
              posX,
              posY,
              this.config.tileSize,
              this.config.tileSize,
            );
            break;
        }
      }
    }
  }

  private resizeCanvas() {
    this.canvas.width = innerWidth * devicePixelRatio;
    this.canvas.height = innerHeight * devicePixelRatio;
    this.offset = {
      x: (this.canvas.width - this.config.tileCount * this.config.tileSize) / 2,
      y:
        (this.canvas.height - this.config.tileCount * this.config.tileSize) / 2,
    };
  }

  public checkTile(pos: { x: number; y: number }, tile?: Tile): boolean {
    if (
      pos.x < 0 ||
      pos.y < 0 ||
      pos.x >= this.arena.length ||
      pos.y >= this.arena[pos.x].length
    )
      return false;
    const target = this.arena[pos.x][pos.y];
    return target !== undefined && (!tile || target === tile);
  }

  public onLose(callback: (player: Player) => void) {
    this.onLoseFn = callback;
  }
}
