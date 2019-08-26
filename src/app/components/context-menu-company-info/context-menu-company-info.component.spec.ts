import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyInfoComponent } from './context-menu-company-info.component';

describe('ContextMenuCompanyInfoComponent', () => {
  let component: ContextMenuCompanyInfoComponent;
  let fixture: ComponentFixture<ContextMenuCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
