import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCaptureInfoComponent } from './context-menu-capture-info.component';

describe('ContextMenuCaptureInfoComponent', () => {
  let component: ContextMenuCaptureInfoComponent;
  let fixture: ComponentFixture<ContextMenuCaptureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCaptureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCaptureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
