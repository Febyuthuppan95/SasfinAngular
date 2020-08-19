import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentWindowPreviewComponent } from './document-window-preview.component';

describe('DocumentWindowPreviewComponent', () => {
  let component: DocumentWindowPreviewComponent;
  let fixture: ComponentFixture<DocumentWindowPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentWindowPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWindowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
