import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateUploadComponent } from './exchange-rate-upload.component';

describe('ExchangeRateUploadComponent', () => {
  let component: ExchangeRateUploadComponent;
  let fixture: ComponentFixture<ExchangeRateUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeRateUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
