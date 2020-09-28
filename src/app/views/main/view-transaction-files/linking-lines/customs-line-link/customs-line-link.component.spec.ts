import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomsLineLinkComponent } from './customs-line-link.component';

describe('CustomsLineLinkComponent', () => {
  let component: CustomsLineLinkComponent;
  let fixture: ComponentFixture<CustomsLineLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomsLineLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomsLineLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
