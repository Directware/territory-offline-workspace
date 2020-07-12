import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsPreviewComponent } from './tags-preview.component';

describe('TagsPreviewComponent', () => {
  let component: TagsPreviewComponent;
  let fixture: ComponentFixture<TagsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
