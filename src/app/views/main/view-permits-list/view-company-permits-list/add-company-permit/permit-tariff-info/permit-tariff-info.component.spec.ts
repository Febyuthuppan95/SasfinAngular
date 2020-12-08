import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitTariffInfoComponent } from './permit-tariff-info.component';

describe('PermitTariffInfoComponent', () => {
  let component: PermitTariffInfoComponent;
  let fixture: ComponentFixture<PermitTariffInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermitTariffInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermitTariffInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
