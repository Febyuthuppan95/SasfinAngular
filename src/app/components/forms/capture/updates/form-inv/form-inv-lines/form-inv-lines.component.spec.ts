import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInvLinesComponent } from './form-inv-lines.component';

describe('FormInvLinesComponent', () => {
  let component: FormInvLinesComponent;
  let fixture: ComponentFixture<FormInvLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInvLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInvLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
