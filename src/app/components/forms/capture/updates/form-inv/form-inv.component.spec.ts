import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInvComponent } from './form-inv.component';

describe('FormInvComponent', () => {
  let component: FormInvComponent;
  let fixture: ComponentFixture<FormInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
