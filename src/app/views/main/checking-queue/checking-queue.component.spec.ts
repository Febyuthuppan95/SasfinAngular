import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingQueueComponent } from './checking-queue.component';

describe('CheckingQueueComponent', () => {
  let component: CheckingQueueComponent;
  let fixture: ComponentFixture<CheckingQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
