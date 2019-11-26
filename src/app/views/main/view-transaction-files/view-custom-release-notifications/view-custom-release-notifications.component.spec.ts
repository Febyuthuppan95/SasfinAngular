import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomReleaseNotificationsComponent } from './view-custom-release-notifications.component';

describe('ViewCustomReleaseNotificationsComponent', () => {
  let component: ViewCustomReleaseNotificationsComponent;
  let fixture: ComponentFixture<ViewCustomReleaseNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomReleaseNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomReleaseNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
