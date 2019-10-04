import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturePreviewComponent } from './capture-preview.component';

describe('CapturePreviewComponent', () => {
  let component: CapturePreviewComponent;
  let fixture: ComponentFixture<CapturePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
