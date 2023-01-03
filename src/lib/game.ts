import Bomb from './bomb';
import Player from './player';

const dirtTile = new Image();
dirtTile.src = new URL('../assets/dirt.jpg', import.meta.url).toString();

export enum Tile {
  wall,
  bomb,
  empty,
}

export default class Game {
  public readonly ctx: CanvasRenderingContext2D;
  public offset = { x: 0, y: 0 };

  public arena: Tile[][] = [];
  public bombs: Bomb[] = [];
  public players: Player[] = [];

  public config = {
    tileSize: 70,
    tileCount: 15,
  };

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw Error('Failed to get context');
    this.ctx = context;

    for (let i = 0; i < this.config.tileCount; i++) {
      this.arena.push([]);
      for (let j = 0; j < this.config.tileCount; j++) {
        this.arena[i].push(Tile.wall);
      }
    }

    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.resizeCanvas();

    setInterval(this.loop.bind(this), 1000 / 60);
  }

  private loop() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.bombs.forEach((bomb) => bomb.tick());

    this.drawArena();

    this.players.forEach((player) => player.draw());
  }

  private drawArena() {
    for (let x = 0; x < this.config.tileCount; x++) {
      for (let y = 0; y < this.config.tileCount; y++) {
        switch (this.arena[x][y]) {
          case Tile.wall:
            this.ctx.drawImage(
              dirtTile,
              x * this.config.tileSize + this.offset.x,
              y * this.config.tileSize + this.offset.y,
              69,
              69,
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
}
