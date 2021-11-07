import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerritoryFeatureComponent } from './territory-feature.component';

describe('TerritoryFeatureComponent', () => {
  let component: TerritoryFeatureComponent;
  let fixture: ComponentFixture<TerritoryFeatureComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TerritoryFeatureComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
