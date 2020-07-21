import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSmdAttachmentsComponent } from './view-smd-attachments.component';

describe('ViewSmdAttachmentsComponent', () => {
  let component: ViewSmdAttachmentsComponent;
  let fixture: ComponentFixture<ViewSmdAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSmdAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSmdAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
