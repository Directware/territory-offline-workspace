import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherSignatureComponent } from './publisher-signature.component';

describe('PublisherSignatureComponent', () => {
  let component: PublisherSignatureComponent;
  let fixture: ComponentFixture<PublisherSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublisherSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
