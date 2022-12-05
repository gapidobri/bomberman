import Component from './component';
import Context from './context';

export abstract class GameObject {
  private readonly components: Component[] = [];

  public setup(context: Context) {
    context = context.copyWith({ gameObject: this });
    for (const component of this.components) {
      component.setup(context);
    }
  }

  public loop(context: Context) {
    context = context.copyWith({ gameObject: this });
    for (const component of this.components) {
      component.loop(context);
    }
  }

  public registerComponent(component: Component) {
    this.components.push(component);
  }

  public getComponent<T extends Component>(
    typeT: new (...params: any[]) => T,
  ): T {
    const component = this.components.find((c) => c instanceof typeT);
    if (!component) throw new Error('Component not found');
    return component as T;
  }
}
