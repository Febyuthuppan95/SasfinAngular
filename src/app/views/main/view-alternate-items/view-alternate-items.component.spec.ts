import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlternateItemsComponent } from './view-alternate-items.component';

describe('ViewAlternateItemsComponent', () => {
  let component: ViewAlternateItemsComponent;
  let fixture: ComponentFixture<ViewAlternateItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAlternateItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAlternateItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
