import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTagsComponent } from './assigned-tags.component';

describe('AssignedTagsComponent', () => {
  let component: AssignedTagsComponent;
  let fixture: ComponentFixture<AssignedTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
