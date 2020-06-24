import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrnComponent } from './form-crn.component';

describe('FormCrnComponent', () => {
  let component: FormCrnComponent;
  let fixture: ComponentFixture<FormCrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
