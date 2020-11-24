import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesStartNowComponent } from './features-start-now.component';

describe('FeaturesStartNowComponent', () => {
  let component: FeaturesStartNowComponent;
  let fixture: ComponentFixture<FeaturesStartNowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesStartNowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesStartNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
