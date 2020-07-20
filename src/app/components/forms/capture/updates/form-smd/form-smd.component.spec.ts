import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSmdComponent } from './form-smd.component';

describe('FormSmdComponent', () => {
  let component: FormSmdComponent;
  let fixture: ComponentFixture<FormSmdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSmdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
