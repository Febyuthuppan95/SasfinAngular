import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesContextMenuComponent } from './companies-context-menu.component';

describe('CompaniesContextMenuComponent', () => {
  let component: CompaniesContextMenuComponent;
  let fixture: ComponentFixture<CompaniesContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
