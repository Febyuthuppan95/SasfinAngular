import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteCompaniesComponent } from './autocomplete-companies.component';

describe('AutocompleteCompaniesComponent', () => {
  let component: AutocompleteCompaniesComponent;
  let fixture: ComponentFixture<AutocompleteCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
