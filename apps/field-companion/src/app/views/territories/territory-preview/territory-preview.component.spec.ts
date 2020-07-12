import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryPreviewComponent } from './territory-preview.component';

describe('TerritoryPreviewComponent', () => {
  let component: TerritoryPreviewComponent;
  let fixture: ComponentFixture<TerritoryPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
