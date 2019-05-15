import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferBookingPage } from './offer-booking.page';

describe('OfferBookingPage', () => {
  let component: OfferBookingPage;
  let fixture: ComponentFixture<OfferBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
