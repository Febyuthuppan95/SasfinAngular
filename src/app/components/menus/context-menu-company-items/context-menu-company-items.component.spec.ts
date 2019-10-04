import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyItemsComponent } from './context-menu-company-items.component';

describe('ContextMenuCompanyItemsComponent', () => {
  let component: ContextMenuCompanyItemsComponent;
  let fixture: ComponentFixture<ContextMenuCompanyItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
