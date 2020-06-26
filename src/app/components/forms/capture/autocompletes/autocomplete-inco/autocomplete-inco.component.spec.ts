import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteIncoComponent } from './autocomplete-inco.component';

describe('AutocompleteIncoComponent', () => {
  let component: AutocompleteIncoComponent;
  let fixture: ComponentFixture<AutocompleteIncoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteIncoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteIncoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
