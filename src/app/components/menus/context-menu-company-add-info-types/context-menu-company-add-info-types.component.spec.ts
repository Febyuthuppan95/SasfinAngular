import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyAddInfoTypesComponent } from './context-menu-company-add-info-types.component';

describe('ContextMenuCompanyAddInfoTypesComponent', () => {
  let component: ContextMenuCompanyAddInfoTypesComponent;
  let fixture: ComponentFixture<ContextMenuCompanyAddInfoTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyAddInfoTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyAddInfoTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
