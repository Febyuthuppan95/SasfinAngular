import { ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector, ComponentRef } from '@angular/core';

@Injectable()
export class ComponentService {

  factoryResolver: ComponentFactoryResolver;
  rootViewContainer: any;
  private componentRef: ComponentRef<any>;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  public setContainer(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public generateComponent(componentInjected: any) {
    const factory = this.factoryResolver.resolveComponentFactory(componentInjected);
    this.componentRef = factory.create(this.rootViewContainer.parentInjector);

    if (this.rootViewContainer) {
      this.rootViewContainer.clear();
    }

    return this.componentRef;
  }

  public renderComponent(component: ComponentRef<any>) {
    this.rootViewContainer.insert(component);
  }

  public destroyComponent() {
    if (this.componentRef) {
        this.componentRef.destroy();
    }
  }
}
