import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBomsLinesErrorListComponent } from './view-company-boms-lines-error-list.component';

describe('ViewCompanyBomsLinesErrorListComponent', () => {
  let component: ViewCompanyBomsLinesErrorListComponent;
  let fixture: ComponentFixture<ViewCompanyBomsLinesErrorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyBomsLinesErrorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyBomsLinesErrorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
