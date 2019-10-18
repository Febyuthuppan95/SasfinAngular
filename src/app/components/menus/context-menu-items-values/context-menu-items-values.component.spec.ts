import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuItemsValuesComponent } from './context-menu-items-values.component';

describe('ContextMenuItemsValuesComponent', () => {
  let component: ContextMenuItemsValuesComponent;
  let fixture: ComponentFixture<ContextMenuItemsValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuItemsValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuItemsValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
