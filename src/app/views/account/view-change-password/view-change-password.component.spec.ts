import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangePasswordComponent } from './view-change-password.component';

describe('ViewChangePasswordComponent', () => {
  let component: ViewChangePasswordComponent;
  let fixture: ComponentFixture<ViewChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
