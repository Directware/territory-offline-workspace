import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerritoryComponent } from './territory.component';

describe('TerritoryComponent', () => {
  let component: TerritoryComponent;
  let fixture: ComponentFixture<TerritoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
