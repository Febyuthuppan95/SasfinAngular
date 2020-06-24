import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCswComponent } from './form-csw.component';

describe('FormCswComponent', () => {
  let component: FormCswComponent;
  let fixture: ComponentFixture<FormCswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
