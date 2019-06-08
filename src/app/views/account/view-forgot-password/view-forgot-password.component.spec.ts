import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewForgotPasswordComponent } from './view-forgot-password.component';

describe('ViewForgotPasswordComponent', () => {
  let component: ViewForgotPasswordComponent;
  let fixture: ComponentFixture<ViewForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
