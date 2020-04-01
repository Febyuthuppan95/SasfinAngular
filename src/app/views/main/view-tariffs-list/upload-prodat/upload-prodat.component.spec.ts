import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProdatComponent } from './upload-prodat.component';

describe('UploadProdatComponent', () => {
  let component: UploadProdatComponent;
  let fixture: ComponentFixture<UploadProdatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProdatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProdatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
