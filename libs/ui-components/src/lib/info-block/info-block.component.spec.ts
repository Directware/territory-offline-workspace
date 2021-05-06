import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoBlockComponent } from './info-block.component';

describe('InfoBlockComponent', () => {
  let component: InfoBlockComponent;
  let fixture: ComponentFixture<InfoBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
