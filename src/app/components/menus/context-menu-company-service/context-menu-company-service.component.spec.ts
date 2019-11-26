import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuCompanyServiceComponent } from './context-menu-company-service.component';

describe('ContextMenuCompanyServiceComponent', () => {
  let component: ContextMenuCompanyServiceComponent;
  let fixture: ComponentFixture<ContextMenuCompanyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuCompanyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuCompanyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
