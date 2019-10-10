import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSAD500LineComponent } from './form-sad500-line.component';

describe('FormSAD500LineComponent', () => {
  let component: FormSAD500LineComponent;
  let fixture: ComponentFixture<FormSAD500LineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSAD500LineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSAD500LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
