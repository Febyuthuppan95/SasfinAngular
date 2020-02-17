import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCaptureQueueComponent } from './context-menu-capture-queue.component';

describe('ContextMenuCaptureQueueComponent', () => {
  let component: ContextMenuCaptureQueueComponent;
  let fixture: ComponentFixture<ContextMenuCaptureQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCaptureQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCaptureQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
