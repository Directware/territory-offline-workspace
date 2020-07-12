import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialConfigurationComponent } from './initial-configuration.component';

describe('InitialConfigurationComponent', () => {
  let component: InitialConfigurationComponent;
  let fixture: ComponentFixture<InitialConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
