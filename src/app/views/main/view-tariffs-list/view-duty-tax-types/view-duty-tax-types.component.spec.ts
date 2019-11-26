import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDutyTaxTypesComponent } from './view-duty-tax-types.component';

describe('ViewDutyTaxTypesComponent', () => {
  let component: ViewDutyTaxTypesComponent;
  let fixture: ComponentFixture<ViewDutyTaxTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDutyTaxTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDutyTaxTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
