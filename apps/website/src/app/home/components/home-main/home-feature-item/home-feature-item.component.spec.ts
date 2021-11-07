import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeFeatureItemComponent } from './home-feature-item.component';

describe('HomeFeatureItemComponent', () => {
  let component: HomeFeatureItemComponent;
  let fixture: ComponentFixture<HomeFeatureItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeFeatureItemComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFeatureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
