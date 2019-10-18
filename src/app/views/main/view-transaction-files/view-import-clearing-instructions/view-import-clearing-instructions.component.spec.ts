import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImportClearingInstructionsComponent } from './view-import-clearing-instructions.component';

describe('ViewImportClearingInstructionsComponent', () => {
  let component: ViewImportClearingInstructionsComponent;
  let fixture: ComponentFixture<ViewImportClearingInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewImportClearingInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewImportClearingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
