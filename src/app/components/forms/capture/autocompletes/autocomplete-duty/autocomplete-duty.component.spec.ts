import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteDutyComponent } from './autocomplete-duty.component';

describe('AutocompleteDutyComponent', () => {
  let component: AutocompleteDutyComponent;
  let fixture: ComponentFixture<AutocompleteDutyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
