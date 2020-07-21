import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewC1AttachmentsComponent } from './view-c1-attachments.component';

describe('ViewC1AttachmentsComponent', () => {
  let component: ViewC1AttachmentsComponent;
  let fixture: ComponentFixture<ViewC1AttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewC1AttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewC1AttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
