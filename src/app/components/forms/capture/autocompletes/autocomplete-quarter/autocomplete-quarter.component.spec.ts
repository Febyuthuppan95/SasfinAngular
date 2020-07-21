import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteQuarterComponent } from './autocomplete-quarter.component';

describe('AutocompleteQuarterComponent', () => {
  let component: AutocompleteQuarterComponent;
  let fixture: ComponentFixture<AutocompleteQuarterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteQuarterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteQuarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
