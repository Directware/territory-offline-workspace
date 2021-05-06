import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudiesInputComponent } from './studies-input.component';

describe('StudiesInputComponent', () => {
  let component: StudiesInputComponent;
  let fixture: ComponentFixture<StudiesInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
