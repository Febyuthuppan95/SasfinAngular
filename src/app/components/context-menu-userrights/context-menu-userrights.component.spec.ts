import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuUserrightsComponent } from './context-menu-userrights.component';

describe('ContextMenuUserrightsComponent', () => {
  let component: ContextMenuUserrightsComponent;
  let fixture: ComponentFixture<ContextMenuUserrightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuUserrightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuUserrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
