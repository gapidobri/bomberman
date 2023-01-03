import Bomb from './bomb';
import Game, { Tile } from './game';

export default class Player {
  public position = { x: 0, y: 0 };
  public controls = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    place: ' ',
  };

  constructor(private game: Game) {
    game.players.push(this);
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  public draw() {
    this.game.ctx?.fillRect(
      this.position.x * this.game.config.tileSize + this.game.offset.x + 5,
      this.position.y * this.game.config.tileSize + this.game.offset.y + 5,
      60,
      60,
    );
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
        this.game.bombs.push(new Bomb(this.game, 2, 2, { ...this.position }));
        break;
    }
  }
}
