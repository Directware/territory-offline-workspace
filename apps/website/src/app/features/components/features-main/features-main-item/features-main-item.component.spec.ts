import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesMainItemComponent } from './features-main-item.component';

describe('FeaturesMainItemComponent', () => {
  let component: FeaturesMainItemComponent;
  let fixture: ComponentFixture<FeaturesMainItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesMainItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesMainItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});