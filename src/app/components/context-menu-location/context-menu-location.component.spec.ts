import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuLocationComponent } from './context-menu-location.component';

describe('ContextMenuLocationComponent', () => {
  let component: ContextMenuLocationComponent;
  let fixture: ComponentFixture<ContextMenuLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
