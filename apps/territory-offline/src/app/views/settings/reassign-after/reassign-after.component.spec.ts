import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignAfterComponent } from './reassign-after.component';

describe('ReassignAfterComponent', () => {
  let component: ReassignAfterComponent;
  let fixture: ComponentFixture<ReassignAfterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignAfterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
