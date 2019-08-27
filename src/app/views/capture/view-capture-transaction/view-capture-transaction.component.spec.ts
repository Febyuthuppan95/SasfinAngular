import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaptureTransactionComponent } from './view-capture-transaction.component';

describe('ViewCaptureTransactionComponent', () => {
  let component: ViewCaptureTransactionComponent;
  let fixture: ComponentFixture<ViewCaptureTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCaptureTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaptureTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
