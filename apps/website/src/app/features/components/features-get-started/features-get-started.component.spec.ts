import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeaturesGetStartedComponent } from './features-get-started.component';

describe('FeaturesGetStartedComponent', () => {
  let component: FeaturesGetStartedComponent;
  let fixture: ComponentFixture<FeaturesGetStartedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesGetStartedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesGetStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
