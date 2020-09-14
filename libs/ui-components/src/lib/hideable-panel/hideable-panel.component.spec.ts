import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideablePanelComponent } from './hideable-panel.component';

describe('HideablePanelComponent', () => {
  let component: HideablePanelComponent;
  let fixture: ComponentFixture<HideablePanelComponent>;

  beforeEach(async(() => {
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
