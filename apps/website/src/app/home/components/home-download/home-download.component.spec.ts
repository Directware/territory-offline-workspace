import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeDownloadComponent} from './home-download.component';

describe('HomeReleaseComponent', () => {
  let component: HomeDownloadComponent;
  let fixture: ComponentFixture<HomeDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeDownloadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
