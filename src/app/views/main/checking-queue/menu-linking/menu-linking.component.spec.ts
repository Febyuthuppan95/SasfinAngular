import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLinkingComponent } from './menu-linking.component';

describe('MenuLinkingComponent', () => {
  let component: MenuLinkingComponent;
  let fixture: ComponentFixture<MenuLinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
