import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVOCComponent } from './form-voc.component';

describe('FormVOCComponent', () => {
  let component: FormVOCComponent;
  let fixture: ComponentFixture<FormVOCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVOCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
