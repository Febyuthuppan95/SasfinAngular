import { ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core';

@Injectable()
export class ComponentService {

  factoryResolver: ComponentFactoryResolver;
  rootViewContainer: any;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  public setContainer(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public renderComponent(componentInjected: any) {
    const factory = this.factoryResolver.resolveComponentFactory(componentInjected);
    const component = factory.create(this.rootViewContainer.parentInjector);
    console.log('rendering');
    this.rootViewContainer.insert(component.hostView);
  }
}
