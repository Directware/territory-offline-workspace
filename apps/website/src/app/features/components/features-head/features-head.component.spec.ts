import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeaturesHeadComponent } from './features-head.component';

describe('FeaturesHeadComponent', () => {
  let component: FeaturesHeadComponent;
  let fixture: ComponentFixture<FeaturesHeadComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FeaturesHeadComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
