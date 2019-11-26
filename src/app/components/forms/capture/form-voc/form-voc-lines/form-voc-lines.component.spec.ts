import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVocLinesComponent } from './form-voc-lines.component';

describe('FormVocLinesComponent', () => {
  let component: FormVocLinesComponent;
  let fixture: ComponentFixture<FormVocLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVocLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVocLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
