import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteItemsComponent } from './autocomplete-items.component';

describe('AutocompleteItemsComponent', () => {
  let component: AutocompleteItemsComponent;
  let fixture: ComponentFixture<AutocompleteItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
