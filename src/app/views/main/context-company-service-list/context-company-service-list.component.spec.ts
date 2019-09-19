import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextCompanyServiceListComponent } from './context-company-service-list.component';

describe('ContextCompanyServiceListComponent', () => {
  let component: ContextCompanyServiceListComponent;
  let fixture: ComponentFixture<ContextCompanyServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextCompanyServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextCompanyServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
