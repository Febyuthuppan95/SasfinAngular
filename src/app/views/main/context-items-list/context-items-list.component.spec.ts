import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextItemsListComponent } from './context-items-list.component';

describe('ContextItemsListComponent', () => {
  let component: ContextItemsListComponent;
  let fixture: ComponentFixture<ContextItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
