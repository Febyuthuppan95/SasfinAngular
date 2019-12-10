import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWaybillComponent } from './form-waybill.component';

describe('FormWaybillComponent', () => {
  let component: FormWaybillComponent;
  let fixture: ComponentFixture<FormWaybillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormWaybillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWaybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
