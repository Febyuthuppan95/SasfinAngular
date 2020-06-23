import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOverrideComponent } from './dialog-override.component';

describe('DialogOverrideComponent', () => {
  let component: DialogOverrideComponent;
  let fixture: ComponentFixture<DialogOverrideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOverrideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
