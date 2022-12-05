import Context from './context';
import { GameObject } from './gameObject';

export default class Game {
  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private interval?: number;

  public width: number;
  public height: number;

  private gameObjects: GameObject[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const canvasCtx = this.canvas.getContext('2d');
    if (!canvasCtx) {
      throw new Error('Failed to get context from canvas');
    }
    this.canvasCtx = canvasCtx;

    this.width = innerWidth * devicePixelRatio;
    this.height = innerHeight * devicePixelRatio;

    canvas.width = this.width;
    canvas.height = this.height;
  }

  public setup() {
    this.width = innerWidth * devicePixelRatio;
    this.height = innerHeight * devicePixelRatio;
    this.canvasCtx.fillRect(0, 0, this.width, this.height);
    this.canvasCtx.fillStyle = '#303030';

    const context = new Context({ game: this });
    for (const gameObject of this.gameObjects) {
      gameObject.setup(context);
    }

    this.interval = setInterval(this.loop.bind(this), 1000 / 60);
  }

  public stop() {
    clearInterval(this.interval);
  }

  private loop() {
    const context = new Context({ game: this });
    for (const gameObject of this.gameObjects) {
      gameObject.loop(context);
    }
  }

  public clear() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
  }

  public add(gameObject: GameObject) {
    this.gameObjects.push(gameObject);
  }
}
