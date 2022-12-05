import Component from '../component';
import context from '../context';
import SpriteComponent from './sprite';

export default class LocationComponent implements Component {
  public setup(context: context) {}
  public loop(context: context) {
    const sprite = context
      .thisGameObject()
      ?.getComponent<SpriteComponent>(SpriteComponent);
  }
}
