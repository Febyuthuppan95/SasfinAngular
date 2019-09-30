import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSAD500Component } from './form-sad500.component';

describe('FormSAD500Component', () => {
  let component: FormSAD500Component;
  let fixture: ComponentFixture<FormSAD500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSAD500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSAD500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
