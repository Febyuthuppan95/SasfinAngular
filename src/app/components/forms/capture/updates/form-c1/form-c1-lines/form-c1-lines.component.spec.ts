import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormC1LinesComponent } from './form-c1-lines.component';

describe('FormC1LinesComponent', () => {
  let component: FormC1LinesComponent;
  let fixture: ComponentFixture<FormC1LinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormC1LinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormC1LinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
