import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadWrapperComponent } from './download-wrapper.component';

describe('DownloadWrapperComponent', () => {
  let component: DownloadWrapperComponent;
  let fixture: ComponentFixture<DownloadWrapperComponent>;

  beforeEach(async(() => {
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
