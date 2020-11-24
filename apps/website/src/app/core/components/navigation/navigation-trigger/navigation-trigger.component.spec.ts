import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTriggerComponent } from './navigation-trigger.component';

describe('NavigationTriggerComponent', () => {
  let component: NavigationTriggerComponent;
  let fixture: ComponentFixture<NavigationTriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationTriggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
