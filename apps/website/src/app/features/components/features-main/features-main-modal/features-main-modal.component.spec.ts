import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesMainModalComponent } from './features-main-modal.component';

describe('FeaturesMainModalComponent', () => {
  let component: FeaturesMainModalComponent;
  let fixture: ComponentFixture<FeaturesMainModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesMainModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesMainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
