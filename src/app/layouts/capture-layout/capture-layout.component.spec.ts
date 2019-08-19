import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureLayoutComponent } from './capture-layout.component';

describe('CaptureLayoutComponent', () => {
  let component: CaptureLayoutComponent;
  let fixture: ComponentFixture<CaptureLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
