import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDashboardStyleComponent } from './edit-dashboard-style.component';

describe('EditDashboardStyleComponent', () => {
  let component: EditDashboardStyleComponent;
  let fixture: ComponentFixture<EditDashboardStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDashboardStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDashboardStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
