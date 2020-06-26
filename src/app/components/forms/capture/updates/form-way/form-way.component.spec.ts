import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWayComponent } from './form-way.component';

describe('FormWayComponent', () => {
  let component: FormWayComponent;
  let fixture: ComponentFixture<FormWayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormWayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
