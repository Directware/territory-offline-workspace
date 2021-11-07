import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeaturesStartNowComponent } from './features-start-now.component';

describe('FeaturesStartNowComponent', () => {
  let component: FeaturesStartNowComponent;
  let fixture: ComponentFixture<FeaturesStartNowComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FeaturesStartNowComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesStartNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
