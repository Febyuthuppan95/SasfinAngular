import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSad500UpdatedComponent } from './form-sad500-updated.component';

describe('FormSad500UpdatedComponent', () => {
  let component: FormSad500UpdatedComponent;
  let fixture: ComponentFixture<FormSad500UpdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSad500UpdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSad500UpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
