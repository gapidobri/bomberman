import Context from './context';

export default abstract class Component {
  public setup(context: Context) {}
  public loop(context: Context) {}
}
