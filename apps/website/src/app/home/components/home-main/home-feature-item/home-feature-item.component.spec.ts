import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFeatureItemComponent } from './home-feature-item.component';

describe('HomeFeatureItemComponent', () => {
  let component: HomeFeatureItemComponent;
  let fixture: ComponentFixture<HomeFeatureItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeFeatureItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFeatureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
