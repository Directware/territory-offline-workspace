import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingDueAfterComponent } from './processing-due-after.component';

describe('ProcessingDueAfterComponent', () => {
  let component: ProcessingDueAfterComponent;
  let fixture: ComponentFixture<ProcessingDueAfterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingDueAfterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingDueAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
