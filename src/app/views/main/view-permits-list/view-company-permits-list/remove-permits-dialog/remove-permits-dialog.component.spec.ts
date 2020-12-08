import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePermitsDialogComponent } from './remove-permits-dialog.component';

describe('RemovePermitsDialogComponent', () => {
  let component: RemovePermitsDialogComponent;
  let fixture: ComponentFixture<RemovePermitsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePermitsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePermitsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
