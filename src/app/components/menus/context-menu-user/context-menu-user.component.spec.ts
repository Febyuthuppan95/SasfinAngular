import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuUserComponent } from './context-menu-user.component';

describe('ContextMenuComponent', () => {
  let component: ContextMenuUserComponent;
  let fixture: ComponentFixture<ContextMenuUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
