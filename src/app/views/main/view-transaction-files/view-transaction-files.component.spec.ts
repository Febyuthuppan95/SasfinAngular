import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionFilesComponent } from './view-transaction-files.component';

describe('ViewTransactionFilesComponent', () => {
  let component: ViewTransactionFilesComponent;
  let fixture: ComponentFixture<ViewTransactionFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransactionFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
