import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteCurrencyComponent } from './autocomplete-currency.component';

describe('AutocompleteCurrencyComponent', () => {
  let component: AutocompleteCurrencyComponent;
  let fixture: ComponentFixture<AutocompleteCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
