import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuServiceClaimsComponent } from './context-menu-service-claims.component';

describe('ContextMenuServiceClaimsComponent', () => {
  let component: ContextMenuServiceClaimsComponent;
  let fixture: ComponentFixture<ContextMenuServiceClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuServiceClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuServiceClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
