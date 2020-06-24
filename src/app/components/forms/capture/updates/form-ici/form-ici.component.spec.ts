import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIciComponent } from './form-ici.component';

describe('FormIciComponent', () => {
  let component: FormIciComponent;
  let fixture: ComponentFixture<FormIciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
