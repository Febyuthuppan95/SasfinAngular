import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteEdiStatusesComponent } from './autocomplete-edi-statuses.component';

describe('AutocompleteEdiStatusesComponent', () => {
  let component: AutocompleteEdiStatusesComponent;
  let fixture: ComponentFixture<AutocompleteEdiStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteEdiStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteEdiStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
