import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureErrorsComponent } from './capture-errors.component';

describe('CaptureErrorsComponent', () => {
  let component: CaptureErrorsComponent;
  let fixture: ComponentFixture<CaptureErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
