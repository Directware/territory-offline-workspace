import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondThreadHeaderComponent } from './second-thread-header.component';

describe('SecondThreadHeaderComponent', () => {
  let component: SecondThreadHeaderComponent;
  let fixture: ComponentFixture<SecondThreadHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondThreadHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondThreadHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
