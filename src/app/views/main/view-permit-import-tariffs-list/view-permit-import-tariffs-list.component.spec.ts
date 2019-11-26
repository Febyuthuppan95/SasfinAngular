import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPermitIMportTariffsListComponent } from './view-permit-import-tariffs-list.component';

describe('ViewPermitIMportTariffsListComponent', () => {
  let component: ViewPermitIMportTariffsListComponent;
  let fixture: ComponentFixture<ViewPermitIMportTariffsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPermitIMportTariffsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPermitIMportTariffsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
