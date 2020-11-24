import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesGetStartedComponent } from './features-get-started.component';

describe('FeaturesGetStartedComponent', () => {
  let component: FeaturesGetStartedComponent;
  let fixture: ComponentFixture<FeaturesGetStartedComponent>;

  beforeEach(async(() => {
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
