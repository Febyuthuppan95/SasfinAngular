import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateItemsComponent } from './dialog-create-items.component';

describe('DialogCreateItemsComponent', () => {
  let component: DialogCreateItemsComponent;
  let fixture: ComponentFixture<DialogCreateItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCreateItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
