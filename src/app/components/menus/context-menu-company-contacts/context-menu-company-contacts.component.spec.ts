import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyContactsComponent } from './context-menu-company-contacts.component';

describe('ContextMenuCompanyContactsComponent', () => {
  let component: ContextMenuCompanyContactsComponent;
  let fixture: ComponentFixture<ContextMenuCompanyContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
