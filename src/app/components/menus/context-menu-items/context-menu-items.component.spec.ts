import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuItemsComponent } from './context-menu-items.component';

describe('ContextMenuItemsComponent', () => {
  let component: ContextMenuItemsComponent;
  let fixture: ComponentFixture<ContextMenuItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
