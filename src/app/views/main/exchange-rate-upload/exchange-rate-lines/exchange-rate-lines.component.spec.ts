import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateLinesComponent } from './exchange-rate-lines.component';

describe('ExchangeRateLinesComponent', () => {
  let component: ExchangeRateLinesComponent;
  let fixture: ComponentFixture<ExchangeRateLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeRateLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
