import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuItemsGroupComponent } from './context-menu-items-group.component';

describe('ContextMenuItemsGroupComponent', () => {
  let component: ContextMenuItemsGroupComponent;
  let fixture: ComponentFixture<ContextMenuItemsGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuItemsGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuItemsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
