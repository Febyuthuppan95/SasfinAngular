import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuItemsParentsComponent } from './context-menu-items-parents.component';

describe('ContextMenuItemsParentsComponent', () => {
  let component: ContextMenuItemsParentsComponent;
  let fixture: ComponentFixture<ContextMenuItemsParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuItemsParentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuItemsParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
