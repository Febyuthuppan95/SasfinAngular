import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuSADLinesComponent } from './context-menu-sadlines.component';

describe('ContextMenuSADLinesComponent', () => {
  let component: ContextMenuSADLinesComponent;
  let fixture: ComponentFixture<ContextMenuSADLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuSADLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuSADLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
