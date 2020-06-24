import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSad500LineUpdatedComponent } from './form-sad500-line-updated.component';

describe('FormSad500LineUpdatedComponent', () => {
  let component: FormSad500LineUpdatedComponent;
  let fixture: ComponentFixture<FormSad500LineUpdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSad500LineUpdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSad500LineUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
