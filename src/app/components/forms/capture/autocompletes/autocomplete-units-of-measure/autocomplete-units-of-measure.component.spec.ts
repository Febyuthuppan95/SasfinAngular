import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteUnitsOfMeasureComponent } from './autocomplete-units-of-measure.component';

describe('AutocompleteUnitsOfMeasureComponent', () => {
  let component: AutocompleteUnitsOfMeasureComponent;
  let fixture: ComponentFixture<AutocompleteUnitsOfMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteUnitsOfMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteUnitsOfMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
