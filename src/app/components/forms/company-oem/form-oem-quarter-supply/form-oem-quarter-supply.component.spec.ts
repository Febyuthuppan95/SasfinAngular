import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOemQuarterSupplyComponent } from './form-oem-quarter-supply.component';

describe('FormOemQuarterSupplyComponent', () => {
  let component: FormOemQuarterSupplyComponent;
  let fixture: ComponentFixture<FormOemQuarterSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOemQuarterSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOemQuarterSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
