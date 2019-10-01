import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrenciesListComponent } from './view-currencies-list.component';

describe('ViewCurrenciesListComponent', () => {
  let component: ViewCurrenciesListComponent;
  let fixture: ComponentFixture<ViewCurrenciesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCurrenciesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurrenciesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
