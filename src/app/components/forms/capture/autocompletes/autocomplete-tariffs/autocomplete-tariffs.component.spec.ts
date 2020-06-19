import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteTariffsComponent } from './autocomplete-tariffs.component';

describe('AutocompleteTariffsComponent', () => {
  let component: AutocompleteTariffsComponent;
  let fixture: ComponentFixture<AutocompleteTariffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteTariffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
