import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCswLinesComponent } from './form-csw-lines.component';

describe('FormCswLinesComponent', () => {
  let component: FormCswLinesComponent;
  let fixture: ComponentFixture<FormCswLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCswLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCswLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
