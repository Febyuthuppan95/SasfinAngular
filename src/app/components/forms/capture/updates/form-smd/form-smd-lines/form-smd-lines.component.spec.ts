import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSmdLinesComponent } from './form-smd-lines.component';

describe('FormSmdLinesComponent', () => {
  let component: FormSmdLinesComponent;
  let fixture: ComponentFixture<FormSmdLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSmdLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSmdLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
