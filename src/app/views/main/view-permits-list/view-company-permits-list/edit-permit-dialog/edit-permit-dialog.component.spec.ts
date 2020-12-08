import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPermitDialogComponent } from './edit-permit-dialog.component';

describe('EditPermitDialogComponent', () => {
  let component: EditPermitDialogComponent;
  let fixture: ComponentFixture<EditPermitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPermitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPermitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
