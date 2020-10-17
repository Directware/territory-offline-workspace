import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnTerritoryCardComponent } from './return-territory-card.component';

describe('ReturnTerritoryCardComponent', () => {
  let component: ReturnTerritoryCardComponent;
  let fixture: ComponentFixture<ReturnTerritoryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnTerritoryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnTerritoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
