import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuUnitsOfMeasureComponent } from './context-menu-units-of-measure.component';

describe('ContextMenuUnitsOfMeasureComponent', () => {
  let component: ContextMenuUnitsOfMeasureComponent;
  let fixture: ComponentFixture<ContextMenuUnitsOfMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuUnitsOfMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuUnitsOfMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
