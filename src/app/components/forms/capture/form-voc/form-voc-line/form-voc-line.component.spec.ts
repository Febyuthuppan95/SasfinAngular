import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVocLineComponent } from './form-voc-line.component';

describe('FormVocLineComponent', () => {
  let component: FormVocLineComponent;
  let fixture: ComponentFixture<FormVocLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVocLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVocLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
