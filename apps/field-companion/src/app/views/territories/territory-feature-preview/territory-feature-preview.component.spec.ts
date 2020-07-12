import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryFeaturePreviewComponent } from './territory-feature-preview.component';

describe('TerritoryFeaturePreviewComponent', () => {
  let component: TerritoryFeaturePreviewComponent;
  let fixture: ComponentFixture<TerritoryFeaturePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryFeaturePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryFeaturePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
