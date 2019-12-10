import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuitDialogComponent } from './quit-dialog.component';

describe('QuitDialogComponent', () => {
  let component: QuitDialogComponent;
  let fixture: ComponentFixture<QuitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
