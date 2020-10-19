import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryFeatureComponent } from './territory-feature.component';

describe('TerritoryFeatureComponent', () => {
  let component: TerritoryFeatureComponent;
  let fixture: ComponentFixture<TerritoryFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
