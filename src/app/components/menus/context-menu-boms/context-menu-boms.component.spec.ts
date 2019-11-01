import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuBomsComponent } from './context-menu-boms.component';

describe('ContextMenuBomsComponent', () => {
  let component: ContextMenuBomsComponent;
  let fixture: ComponentFixture<ContextMenuBomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuBomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuBomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
