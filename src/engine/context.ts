import Component from './component';
import Game from './game';
import { GameObject } from './gameObject';

type ContextProps = {
  game?: Game;
  gameObject?: GameObject;
  component?: Component;
};

export default class Context {
  private readonly _game?: Game;
  private readonly _gameObject?: GameObject;
  private readonly _component?: Component;

  constructor(context: ContextProps) {
    this._game = context.game;
    this._gameObject = context.gameObject;
    this._component = context.component;
  }

  public copyWith(context: ContextProps): Context {
    return new Context({
      game: this._game ?? context.game,
      gameObject: this._gameObject ?? context.gameObject,
      component: this._component ?? context.component,
    });
  }

  public get game(): Game {
    if (!this._game) throw new Error('Game not found');
    return this._game;
  }

  public get gameObject(): GameObject {
    if (!this._gameObject) throw new Error('Game object not found');
    return this._gameObject;
  }

  public get component(): Component {
    if (!this._gameObject) throw new Error('Game object not found');
    return this._gameObject;
  }
}
