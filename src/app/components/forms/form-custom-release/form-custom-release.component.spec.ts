import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCustomReleaseComponent } from './form-custom-release.component';

describe('FormCustomReleaseComponent', () => {
  let component: FormCustomReleaseComponent;
  let fixture: ComponentFixture<FormCustomReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCustomReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCustomReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
