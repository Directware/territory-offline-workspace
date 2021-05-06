import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HideablePanelComponent } from './hideable-panel.component';

describe('HideablePanelComponent', () => {
  let component: HideablePanelComponent;
  let fixture: ComponentFixture<HideablePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HideablePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideablePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
