import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadWrapperComponent } from './download-wrapper.component';

describe('DownloadWrapperComponent', () => {
  let component: DownloadWrapperComponent;
  let fixture: ComponentFixture<DownloadWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
