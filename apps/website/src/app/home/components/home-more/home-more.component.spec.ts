import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMoreComponent } from './home-more.component';

describe('HomeMoreComponent', () => {
  let component: HomeMoreComponent;
  let fixture: ComponentFixture<HomeMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
